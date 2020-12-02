const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

// get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// join chatroom
socket.emit('joinRoom', { username, room });

socket.on('message', message => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatForm.addEventListener('submit', e => {
  e.preventDefault();

  const msg = e.target.elements.msg.value; // child

  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>
  `;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  if (users) {
    users.forEach(user => {
      userList.innerHTML += `
      <li>${user.username}</li>
      `;
    });
  }
}
