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

// Determine CORS origin dynamically for Socket.IO and Express
const CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://my-frontend-five-zeta.vercel.app' // Fallback to provided Vercel URL
    : 'http://localhost:3000'; // For local development

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: CLIENT_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true // Allow cookies/authorization headers
    },
});

// Middleware
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true })); // Ensure credentials are true for auth headers
app.use(express.json()); // For parsing JSON request bodies
app.use(express.urlencoded({ extended: false })); // For parsing URL-encoded request bodies

// Serve static files (uploaded files) - WARNING: Not persistent on Vercel serverless
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('sendMessage', (messageData) => {
        // In a more robust system, messageData would contain actual message object
        // that was just saved to DB, including sender/receiver info.
        // For demonstration, we simply relay.

        // Emit to the sender's room (for immediate update on their screen)
        io.to(messageData.sender_id).emit('receiveMessage', messageData);
        // Emit to the receiver's room
        io.to(messageData.receiver_id).emit('receiveMessage', messageData);

        console.log(`Message from ${messageData.sender_id} to ${messageData.receiver_id}: ${messageData.content || messageData.file_name}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});


// Database synchronization and server start
const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
    try {
        await sequelize.authenticate(); // Test the connection first
        console.log('Database connection has been established successfully.');

        // Only sync models in development environment
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synced successfully in development mode.');
        } else {
            console.log('Skipping database sync in production mode.');
        }

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database or sync models:', err);
        // In a production app, you might want to exit the process here
        // process.exit(1);
    }
};

startServer();