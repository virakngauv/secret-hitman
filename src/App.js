import logo from './logo.svg';
import './App.css';
import { Server } from 'socket.io';

const io = new Server(server);

// server-side
io.on("connection", (socket) => {
  socket.on("ping", (cb) => {
    if (typeof cb === "function")
      cb();
  });
});

// client-side
setInterval(() => {
  const start = Date.now();

  // volatile, so the packet will be discarded if the socket is not connected
  socket.volatile.emit("ping", () => {
    const latency = Date.now() - start;
    // ...
  });
}, 5000);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {latency}
      </header>
    </div>
  );
}

export default App;
