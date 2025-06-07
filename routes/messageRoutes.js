// server/routes/messageRoutes.js
const express = require('express');
const { sendMessage, getMessages, getChatUsers, searchUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload'); // Our multer upload utility
const router = express.Router();

// Route for sending messages (can include file uploads)
router.post('/send', protect, upload.single('file'), sendMessage); // 'file' is the field name for the file
router.get('/:receiver_id', protect, getMessages); // Get messages for a specific chat partner
router.get('/chats/users', protect, getChatUsers); // Get users you have chatted with
router.get('/users/search', protect, searchUsers); // Search for other users

module.exports = router;