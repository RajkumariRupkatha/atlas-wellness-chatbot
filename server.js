require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

const openaiKey = process.env.OPENAI_API_KEY || process.env.API_KEY;
if (!openaiKey) {
  console.error('ERROR: OPENAI_API_KEY (or API_KEY) is required in .env');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiKey });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_KEY are required in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Helper functions for Supabase
async function ensureUser(userId) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ id: userId, email: null })
    .select();
  if (error) throw error;
  return data[0];
}

async function getOrCreateSession(userId) {
  // Get the latest session for the user
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  if (sessions.length > 0) return sessions[0];

  // Create new session
  const { data, error: insertError } = await supabase
    .from('sessions')
    .insert({ user_id: userId })
    .select();
  if (insertError) throw insertError;
  return data[0];
}

async function getMessages(sessionId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function insertMessage(sessionId, role, content) {
  const { data, error } = await supabase
    .from('messages')
    .insert({ session_id: sessionId, role, content })
    .select();
  if (error) throw error;
  return data[0];
}

async function resetSession(userId) {
  // Create a new session for the user
  const { data, error } = await supabase
    .from('sessions')
    .insert({ user_id: userId })
    .select();
  if (error) throw error;
  return data[0];
}

function wantsSpanish(content) {
  const spanishKeywords = ['hola', 'gracias', 'por favor', 'adi�s', 'buenos', 'salud', 'bienvenido', 'buenas'];
  const lower = content.toLowerCase();
  return spanishKeywords.some((kw) => lower.includes(kw));
}

function hasClearNonEnglish(content) {
  // detect likely non-English words by Spanish accents and common Spanish tokens
  if (/[áéíóúñü¿¡]/i.test(content)) return true;
  if (wantsSpanish(content)) return true;
  return false;
}




app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required and must be a string' });
    }

    if (hasClearNonEnglish(message)) {
      return res.json({
        message: 'Please write in English only. Atlas is an English-language personal health assistant and cannot respond to Spanish input. Thank you!',
        isEnglishRequired: true,
      });
    }

    const id = userId || 'anonymous';
    await ensureUser(id);
    const session = await getOrCreateSession(id);
    await insertMessage(session.id, 'user', message);

    // Saludo directo mejorado
    const lowerMsg = message.trim().toLowerCase().replace(/[^a-záéíóúüñ ]/gi, '').replace(/\s+/g, ' ');
    const greetings = ['hello', 'hi', 'hey', 'hola', 'buenas'];
    if (greetings.some(g => lowerMsg === g)) {
      const welcome = "Hello! I'm Atlas, your health assistant. How can I support your well-being today?";
      await insertMessage(session.id, 'assistant', welcome);
      return res.json({ message: welcome });
    }

    // Conversational, health assistant persona
    const systemMessage = {
      role: 'system',
      content: `You are Atlas, a professional, friendly, and conversational health and wellness assistant. If the user greets you (e.g., hello, hi, hey), ONLY reply with a short, warm greeting and ask how you can help—do NOT give any tips, lists, or recommendations in your greeting. If the user asks for tips, advice, or recommendations, respond with a concise numbered list. For all other queries, answer conversationally and empathetically. Never provide medical diagnoses or treatment plans.`,
    };
    const messages = await getMessages(session.id);
    const chatMessages = messages.map((msg) => ({ role: msg.role, content: msg.content }));
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [systemMessage, ...chatMessages],
      max_tokens: 400,
      temperature: 0.7,
    });
    const assistantMessage = completion.choices?.[0]?.message?.content?.trim() || 'I did not get a response from the model. Please try again.';
    await insertMessage(session.id, 'assistant', assistantMessage);
    return res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/history', async (req, res) => {
  const userId = req.query.userId || 'anonymous';
  try {
    const session = await getOrCreateSession(userId);
    const messages = await getMessages(session.id);
    res.json({ messages });
  } catch (error) {
    console.error('Error in /api/history:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.post('/api/reset', async (req, res) => {
  const userId = req.body.userId || 'anonymous';
  try {
    await resetSession(userId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in /api/reset:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Manejo global de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Atlas server running at http://localhost:${PORT}`);
});
