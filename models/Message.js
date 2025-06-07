// server/models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // Import the User model

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // This references the User model
            key: 'id',
        },
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // This references the User model
            key: 'id',
        },
    },
    message_type: {
        type: DataTypes.ENUM('text', 'image', 'document', 'audio', 'video', 'other_file'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT, // For text messages
        allowNull: true,
    },
    file_url: {
        type: DataTypes.STRING(255), // Path to the stored file
        allowNull: true,
    },
    file_name: {
        type: DataTypes.STRING(255), // Original file name
        allowNull: true,
    },
    mime_type: {
        type: DataTypes.STRING(100), // MIME type of the file
        allowNull: true,
    },
}, {
    tableName: 'messages', // Match your SQL table name
});

// Define associations
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });

module.exports = Message;