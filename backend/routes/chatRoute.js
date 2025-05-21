// routes/chatRoute.js
import express from 'express';
import { Server } from 'socket.io';

const router = express.Router();

// In-memory storage for chat messages (for testing purposes)
let messages = [];

// Define a route to get previous messages (optional)
router.get('/messages/:appointmentId', (req, res) => {
  const { appointmentId } = req.params;
  const filtered = messages.filter(msg => msg.roomId === appointmentId);
  res.json(filtered);
});


// Define a route for the chat itself, although this is not really needed for socket communication
router.get('/socket', (req, res) => {
  res.send('Socket route is working');
});

export default router;
