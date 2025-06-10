// server/controllers/messageController.js
const Message = require('../models/Message');
const User = require('../models/User'); // To fetch user details
const { Op } = require('sequelize'); // For OR queries

// Helper function to determine message_type
const getMessageType = (mimeType) => {
    if (!mimeType) return 'text'; // Default for text messages
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || mimeType.includes('msword') || mimeType.includes('spreadsheet')) return 'document';
    return 'other_file';
};

exports.sendMessage = async (req, res) => {
    const { receiver_id, content } = req.body; // content is only for text messages
    const sender_id = req.user.id; // From authMiddleware

    let file_url = null;
    let file_name = null;
    let mime_type = null;
    let message_type = 'text';

    if (req.file) {
        file_url = `/uploads/${req.file.filename}`;
        file_name = req.file.originalname;
        mime_type = req.file.mimetype;
        message_type = getMessageType(mime_type);
    } else if (content) {
        message_type = 'text';
    } else {
        return res.status(400).json({ message: 'Message content or file is required.' });
    }

    try {
        const message = await Message.create({
            sender_id,
            receiver_id,
            message_type,
            content: message_type === 'text' ? content : null,
            file_url,
            file_name,
            mime_type,
        });

        // Fetch sender and receiver details for the message object before sending
        const fullMessage = await Message.findByPk(message.id, {
            include: [
                { model: User, as: 'sender', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'receiver', attributes: ['id', 'username', 'email'] },
            ],
        });

        // This fullMessage object will be emitted via Socket.IO in server.js
        res.status(201).json(fullMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error while sending message' });
    }
};

exports.getMessages = async (req, res) => {
    const { receiver_id } = req.params; // The ID of the person you are chatting with
    const userId = req.user.id; // Your ID

    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender_id: userId, receiver_id: receiver_id },
                    { sender_id: receiver_id, receiver_id: userId },
                ],
            },
            order: [['createdAt', 'ASC']], // Order by creation time
            include: [
                { model: User, as: 'sender', attributes: ['id', 'username'] },
                { model: User, as: 'receiver', attributes: ['id', 'username'] },
            ],
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error while fetching messages' });
    }
};

exports.getChatUsers = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find all unique users that the current user has chatted with
        const chattedUserIds = await Message.findAll({
            attributes: [
                [sequelize.literal('DISTINCT CASE WHEN sender_id = ' + userId + ' THEN receiver_id ELSE sender_id END'), 'chatPartnerId']
            ],
            where: {
                [Op.or]: [
                    { sender_id: userId },
                    { receiver_id: userId }
                ]
            },
            raw: true
        });

        const uniqueChatPartnerIds = Array.from(new Set(chattedUserIds.map(u => u.chatPartnerId)));

        if (uniqueChatPartnerIds.length === 0) {
            return res.json([]);
        }

        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: uniqueChatPartnerIds
                }
            },
            attributes: ['id', 'username', 'email']
        });

        res.json(users);

    } catch (error) {
        console.error('Error fetching chat users:', error);
        res.status(500).json({ message: 'Server error while fetching chat users' });
    }
};

// ... (other imports and functions)

exports.searchUsers = async (req, res) => {
    const { query } = req.query; // query can be undefined if not provided
    const userId = req.user.id;

    try {
        let whereCondition = {
            id: {
                [Op.ne]: userId // Exclude current user from search results
            }
        };

        if (query) {
            whereCondition.username = {
                [Op.like]: `%${query}%` // Case-insensitive search
            };
        }

        const users = await User.findAll({
            where: whereCondition,
            attributes: ['id', 'username', 'email']
        });
        res.json(users);
    } catch (error) {
        console.error('Error during user search:', error);
        res.status(500).json({ message: 'Server error during user search' });
    }
};