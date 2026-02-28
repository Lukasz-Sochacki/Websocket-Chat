const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New Client! Its id - ' + socket.id);

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('join', (login) => {
    users.push({ name: login, id: socket.id });
    console.log('User has beed added: ' + login + ' ' + socket.id);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      console.log(`User ${users[index].name} has left!`);
      users.splice(index, 1);
    }
  });
  console.log("I've added a listener on message event \n");
});

app.use(express.static(path.join(__dirname, './client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/index.html'));
});

const messages = [];
const users = [];
