const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');

const port = 3000;
let startTime;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('getIP', (data) => {
    const internalIP = socket.handshake.address;
    const externalIP = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    const port = socket.request.connection.remotePort; // new line

    // Calculate the connection time in hours, minutes, and seconds
    const endTime = new Date();
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Get the current timestamp with the local timezone and 24-hour format
    const timestamp = new Date().toLocaleString('en-US', { hour12: false });

    console.log(`timestamp: ${timestamp}`);
    console.log(`internal IP: ${internalIP}`);
    console.log(`external IP: ${externalIP}`);
    console.log(`port: ${port}`); // new line
    console.log(`connection time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    socket.emit('ip', { internalIP, externalIP, port, hours, minutes, seconds, timestamp }); // added port to the object being emitted
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  startTime = new Date();
});

