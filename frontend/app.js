const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const resetBtn = document.getElementById('resetBtn');
const statusText = document.createElement('div');
statusText.className = 'status';
chatForm.insertAdjacentElement('afterend', statusText);

function addMessage(text, role) {
  const div = document.createElement('div');
  div.className = `message ${role}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  requestAnimationFrame(() => div.classList.add('visible'));
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setTyping(isTyping) {
  let typingNode = document.querySelector('.typing-indicator');
  if (!typingNode && isTyping) {
    typingNode = document.createElement('div');
    typingNode.className = 'typing-indicator typing-dots';
    typingNode.textContent = 'Atlas is typing';
    chatWindow.appendChild(typingNode);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  if (!isTyping && typingNode) {
    typingNode.remove();
  }
}

async function sendMessage(content) {
  addMessage(content, 'user');

  chatForm.elements[0].disabled = true;
  chatForm.elements[1].disabled = true;
  const originalText = chatForm.elements[1].textContent;
  chatForm.elements[1].innerHTML = '<span class="spinner"></span>Sending...';
  statusText.textContent = 'Sending your question to Atlas...';
  setTyping(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Server error');

    setTyping(false);
    const assistantText = data.message || 'No response from assistant.';
    await new Promise((resolve) => setTimeout(resolve, 600));
    addMessage(assistantText, 'assistant');
    statusText.textContent = 'Atlas answered. Continue with another question when ready.';
  } catch (err) {
    setTyping(false);
    addMessage('Error: ' + err.message, 'assistant');
    statusText.textContent = 'Could not reach Atlas. Check your network and try again.';
  } finally {
    chatForm.elements[0].disabled = false;
    chatForm.elements[1].disabled = false;
    chatForm.elements[1].textContent = originalText;
  }
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  sendMessage(text);
});

resetBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'anonymous' }),
    });
    chatWindow.innerHTML = '';
    addMessage('Conversation has been reset. Ready when you are to continue wellness progress.', 'assistant');
    statusText.textContent = 'Session reset complete.';
  } catch (err) {
    statusText.textContent = 'Could not reset. Please try again.';
  }
});

addMessage('Welcome to Atlas. I\'m here to support your well-being with practical, personalized daily habits and mindset strategies. Share one area you\'d like to improve today—sleep, energy, stress, or motivation.', 'assistant');
