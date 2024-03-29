const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const path = require('path');
const moment = require('moment');

const port = 3000;
let startTime;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('getIP', (data) => {
    const internalIP = socket.handshake.address;
    const xForwardedFor = socket.request.headers['x-forwarded-for'];
    const externalIP = xForwardedFor ? xForwardedFor.split(',')[0].trim() : socket.request.connection.remoteAddress;
    const port = socket.request.connection.remotePort; 

  
   const endTime = moment(); 
   const diff = moment.duration(endTime.diff(startTime)).add(1, 'hour'); 
   const hours = diff.hours();
   const minutes = diff.minutes();
   const seconds = diff.seconds();

   
   const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    console.log(`timestamp: ${timestamp}`);
    console.log(`internal IP: ${internalIP}`);
    console.log(`external IP: ${externalIP}`);
    console.log(`port: ${port}`); // new line
    console.log(`connection time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);

    socket.emit('ip', { internalIP, externalIP, port, hours, minutes, seconds, timestamp }); 
  });
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
  startTime = new Date();
});

