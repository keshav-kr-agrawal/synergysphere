const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/notifications', require('./routes/notifications'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join project room
  socket.on('join-project', (projectId) => {
    socket.join(projectId);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Leave project room
  socket.on('leave-project', (projectId) => {
    socket.leave(projectId);
    console.log(`User ${socket.id} left project ${projectId}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    io.to(data.projectId).emit('new-message', data);
  });

  // Handle task updates
  socket.on('task-updated', (data) => {
    io.to(data.projectId).emit('task-changed', data);
  });

  // Handle notifications
  socket.on('send-notification', (data) => {
    io.to(data.userId).emit('new-notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/synergysphere')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
