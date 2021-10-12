// const express = require('express');
// const path = require('path');
// const app = express();

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// app.listen(80);

// Start socket.io example
const express = require('express');
// const fs = require('fs');
const path = require('path');
const app = express();
const http = require('http');
// const https = require('https');
const { Server } = require("socket.io");

// const privateKey = fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/privkey.pem');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/fullchain.pem');

// const credentials = {
//   key: privateKey,
// 	cert: certificate
// }

const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

const io = new Server();
io.attach(httpServer);
// io.attach(httpsServer);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(80, () => {
  console.log('listening on *:80');
});

// server.listen(443, () => {
//   console.log('listening on *:443');
// });
// // End socket.io example

// Start latency test
// server-side
io.on("connection", (socket) => {
  socket.on("ping", (cb) => {
    console.log("got a ping (server code), socket.id is", socket.id)
    if (typeof cb === "function")
      cb();
  });

  // // Random flipped test
  // setInterval(() => {
  //   const start = Date.now();

  //   // volatile, so the packet will be discarded if the socket is not connected
  //   socket.volatile.emit("ping", () => {
  //     const latency = Date.now() - start;
  //     console.log(latency + " ms");
  //     // ...

  //     // const latencyText = document.querySelector('#latency');
  //     // latencyText.innerText = latency + " ms";
  //   });

  //   socket.volatile.emit("ping", "not-a-function-a-string-actually");
  // }, 5000);
});


// End latency test
