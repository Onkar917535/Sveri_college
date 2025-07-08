document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  addMessage('You', message, 'user');
  input.value = '';

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const formattedReply = formatBotReply(data.reply);
    addMessage('Chatbot', formattedReply, 'bot');
  } catch (err) {
    addMessage('Chatbot', '[Error contacting server]', 'bot');
  }
});

function addMessage(sender, text, className) {
  const chatWindow = document.getElementById('chat-window');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${className}`;
  msgDiv.innerHTML = `<strong>${sender}:</strong><br>${text}`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function formatBotReply(text) {
  const lines = text.split('\n');
  let inList = false;
  let html = '';

  for (let line of lines) {
    line = line.trim();

    // If line starts with a bullet point (*)
    if (line.startsWith('')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      const item = line.replace(/\*/g, '');
      html += `<li>${item}</li>`;
    } else if (line === '') {
      // Skip blank lines
      continue;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${line}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}
