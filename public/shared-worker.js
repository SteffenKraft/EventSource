// shared-worker.js

let ports = [];
let latestState = {
  count: 0,
  progress: 0,
  date: "",
};
const eventSource = new EventSource("http://localhost:4000/api/sse");

// Function to broadcast messages to all connected ports
function broadcast(data) {
  ports.forEach((port) => port.postMessage(data));
}

// Listen for messages from the backend via SSE
eventSource.onmessage = (event) => {
  const [type, value] = event.data.split("|");

  // Update the latest state
  if (type === "count") {
    latestState.count = parseInt(value);
  } else if (type === "progress") {
    latestState.progress = parseInt(value);
  } else if (type === "date") {
    latestState.date = value;
  }
  broadcast(event.data);
};

// Handle new connections from tabs
self.onconnect = (event) => {
  const port = event.ports[0];
  ports.push(port);

  // Send the latest state to the newly connected port
  port.postMessage(`count|${latestState.count}`);
  port.postMessage(`progress|${latestState.progress}`);
  port.postMessage(`date|${latestState.date}`);

  // Listen for disconnects
  port.onmessage = (e) => {
    if (e.data === "disconnect") {
      ports = ports.filter((p) => p !== port);
    }
  };
};
