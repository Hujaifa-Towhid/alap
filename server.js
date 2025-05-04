const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Root route serve করে সরাসরি HTML পেইজ পাঠানো
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>2-Person Chat</title>
      <style>
        body { font-family: sans-serif; background: #f0f0f0; padding: 20px; }
        #messages { list-style: none; padding: 0; max-height: 300px; overflow-y: auto; }
        #messages li { padding: 5px 10px; margin: 5px 0; border-radius: 10px; max-width: 70%; }
        .me { background: #d1e7dd; align-self: flex-end; margin-left: auto; text-align: right; }
        .them { background: #f8d7da; align-self: flex-start; margin-right: auto; text-align: left; }
        #form { display: flex; margin-top: 10px; }
        #input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        #send { padding: 10px; }
        #chatbox { display: flex; flex-direction: column; gap: 10px; }
      </style>
    </head>
    <body>
      <h2>2-Person Chat</h2>
      <div id="chatbox">
        <ul id="messages"></ul>
        <form id="form">
          <input id="input" autocomplete="off" placeholder="Type your message..." />
          <button id="send">Send</button>
        </form>
      </div>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');

        form.addEventListener('submit', function(e) {
          e.preventDefault();
          if (input.value) {
            const li = document.createElement('li');
            li.textContent = input.value;
            li.className = 'me';
            messages.appendChild(li);
            window.scrollTo(0, document.body.scrollHeight);
            socket.emit('chat message', input.value);
            input.value = '';
          }
        });

        socket.on('chat message', function(msg) {
          const li = document.createElement('li');
          li.textContent = msg;
          li.className = 'them';
          messages.appendChild(li);
          window.scrollTo(0, document.body.scrollHeight);
        });
      </script>
    </body>
    </html>
  `);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Server running on port', PORT);
});