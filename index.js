const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Set up Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev — secure this for prod
    methods: ['GET', 'POST'],
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// POST endpoint to receive NFC card data
app.post('/nfc', (req, res) => {
  const { card_id } = req.body;

  if (!card_id) {
    return res.status(400).json({ error: 'card_id is required' });
  }

  console.log('📨 Received card_id:', card_id);

  // Broadcast to all connected clients
  io.emit('nfc-scan', { card_id });

  res.status(200).json({ status: 'ok', broadcasted: true });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Express + Socket.IO server running at http://localhost:${PORT}`);
});
