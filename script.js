require("dotenv").config();

const readline = require("readline");
const { OpenAI } = require("openai");

const apiKey = process.env.OPENAI_API_KEY || process.env.API_KEY;
if (!apiKey) {
  console.error("ERROR: OPENAI_API_KEY (or API_KEY) is not set in .env");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.on("line", async (line) => {
  const prompt = line.trim();
  if (!prompt) {
    rl.prompt();
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices?.[0]?.message?.content;
    console.log(text?.trim() ?? "(no response)");
  } catch (err) {
    console.error("OpenAI request failed:", err);
  } finally {
    rl.prompt();
  }
});

rl.on("close", () => {
  console.log("Goodbye!");
  process.exit(0);
});
