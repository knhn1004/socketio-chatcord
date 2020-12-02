const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);

const PORT = 3000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'public')));

const io = socketio(server);

const botname = 'ChatCord Bot';

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // single client
    socket.emit('message', formatMessage(botname, 'welcome to chatcord'));

    // all the clients (including this one)
    // broadcasts when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botname, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit('roomUsers', getRoomUsers(user.room));
  });
  console.log('new ws connection...');

  // all the client except this
  // io.emit()

  // listen for chat message
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botname, `${user.username} has left the chat`)
      );
      userLeave(user.id);
      io.to(user.room).emit('roomUsers', getRoomUsers(user.room));
    }
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
