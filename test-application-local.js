// const express = require('express');
// const path = require('path');
// const app = express();

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(80);

// Start socket.io example
const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
// End socket.io example

// Start latency test
// server-side
io.on("connection", (socket) => {
  socket.on("ping", (cb) => {
    if (typeof cb === "function")
      cb();
  });
});
// End latency test