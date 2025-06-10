const express = require('express');
const { sendMessage, getMessages, getChatUsers, searchUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload'); // Our multer upload utility
const router = express.Router();

// Route for sending messages (can include file uploads)
router.post('/send', protect, upload.single('file'), sendMessage); // 'file' is the field name for the file
router.get('/:receiver_id', protect, getMessages); // Get messages for a specific chat partner
router.get('/chats/users', protect, getChatUsers); // Get users you have chatted with

// --- ADD THIS NEW ROUTE ---
// This route will handle GET /api/messages/users or /api/messages/users?query=...
// It uses the existing searchUsers controller
router.get('/users', protect, searchUsers); // This will handle /api/messages/users (and search if query is provided)
// Keep the /users/search route if you still need it, otherwise remove it
router.get('/users/search', protect, searchUsers); // (Optional: Remove if you want /api/messages/users to be the primary search)

module.exports = router;