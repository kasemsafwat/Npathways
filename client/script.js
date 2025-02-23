const socket = io.connect('http://localhost:5024');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const messagesContainer = document.getElementById('messages');

function sendMessage() {
  const message = messageInput.value;
  socket.emit('sendMessage', message);
  messageInput.value = '';
  messageInput.focus();
}
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

socket.on('messageSent', (message) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerText = message;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});
