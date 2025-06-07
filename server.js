// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const User = require('./models/User'); // Import models to ensure they are defined with Sequelize
const Message = require('./models/Message'); // Import models

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow requests from your React app
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: false })); // For parsing URL-encoded request bodies

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // When a user connects, they should join a room identified by their user ID
    // This allows sending private messages to that user ID's room
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    // Handle incoming messages from clients
    // This event should ideally be triggered after the message is saved to DB via REST API
    // We emit it directly here for simplicity, but in a real app,
    // the 'sendMessage' API endpoint should save the message, then use io.emit to push it.
    socket.on('sendMessage', (messageData) => {
        // In a more robust system, messageData would contain actual message object
        // that was just saved to DB, including sender/receiver info.
        // For demonstration, we simply relay.

        // Emit to the sender's room (for immediate update on their screen)
        io.to(messageData.sender_id).emit('receiveMessage', messageData);
        // Emit to the receiver's room
        io.to(messageData.receiver_id).emit('receiveMessage', messageData);

        console.log(`Message from ${messageData.sender_id} to ${messageData.receiver_id}:, messageData.content || messageData.file_name`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});


// Database synchronization and server start
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }) // alter: true will update tables without dropping data (use with caution in production)
    .then(() => {
        console.log('Database synced successfully.');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database or sync models:', err);
    });