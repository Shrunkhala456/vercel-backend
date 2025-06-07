// server/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Set to true to see SQL queries in console
        define: {
            timestamps: true, // Automatically add createdAt and updatedAt columns
        },
    }
);

module.exports = sequelize;