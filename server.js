// // // require('dotenv').config();
// // // const express = require('express');
// // // const mysql = require('mysql2/promise'); // Using promise-based mysql2
// // // const http = require('http');
// // // const { Server } = require('socket.io');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const fs = require('fs'); // For file system operations

// // // const app = express();
// // // const server = http.createServer(app);
// // // const io = new Server(server, {
// // //     cors: {
// // //         origin: "http://localhost:3000", // Your React app's origin
// // //         methods: ["GET", "POST"]
// // //     }
// // // });

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json()); // For parsing JSON request bodies
// // // app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// // // // Database Connection Pool
// // // const pool = mysql.createPool({
// // //     host: process.env.DB_HOST,
// // //     user: process.env.DB_USER,
// // //     password: process.env.DB_PASSWORD,
// // //     database: process.env.DB_NAME,
// // //     waitForConnections: true,
// // //     connectionLimit: 10,
// // //     queueLimit: 0
// // // });

// // // // Ensure uploads directory exists
// // // const uploadsDir = path.join(__dirname, 'uploads');
// // // if (!fs.existsSync(uploadsDir)) {
// // //     fs.mkdirSync(uploadsDir);
// // // }

// // // // Multer storage configuration for file uploads
// // // const storage = multer.diskStorage({
// // //     destination: (req, file, cb) => {
// // //         cb(null, 'uploads/');
// // //     },
// // //     filename: (req, file, cb) => {
// // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // //         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
// // //     }
// // // });

// // // const upload = multer({ storage: storage });

// // // // --- API Endpoints ---

// // // // User Registration (Basic - in a real app, hash passwords!)
// // // app.post('/api/register', async (req, res) => {
// // //     const { username, password } = req.body;
// // //     if (!username || !password) {
// // //         return res.status(400).json({ message: 'Username and password are required.' });
// // //     }
// // //     try {
// // //         const [result] = await pool.execute(
// // //             'INSERT INTO users (username, password) VALUES (?, ?)',
// // //             [username, password]
// // //         );
// // //         res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
// // //     } catch (error) {
// // //         if (error.code === 'ER_DUP_ENTRY') {
// // //             return res.status(409).json({ message: 'Username already exists.' });
// // //         }
// // //         console.error('Error registering user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // User Login (Basic - in a real app, use JWTs for authentication)
// // // app.post('/api/login', async (req, res) => {
// // //     const { username, password } = req.body;
// // //     try {
// // //         const [rows] = await pool.execute(
// // //             'SELECT id, username, password FROM users WHERE username = ?',
// // //             [username]
// // //         );
// // //         if (rows.length === 0) {
// // //             return res.status(401).json({ message: 'Invalid username or password.' });
// // //         }
// // //         const user = rows[0];
// // //         // In a real app, compare hashed passwords: bcrypt.compareSync(password, user.password)
// // //         if (password !== user.password) {
// // //             return res.status(401).json({ message: 'Invalid username or password.' });
// // //         }
// // //         res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
// // //     } catch (error) {
// // //         console.error('Error logging in user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Get User by ID (for demonstration)
// // // app.get('/api/users/:id', async (req, res) => {
// // //     const userId = req.params.id;
// // //     try {
// // //         const [rows] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [userId]);
// // //         if (rows.length === 0) {
// // //             return res.status(404).json({ message: 'User not found.' });
// // //         }
// // //         res.json(rows[0]);
// // //     } catch (error) {
// // //         console.error('Error fetching user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Get all users (for selecting receiver)
// // // app.get('/api/users', async (req, res) => {
// // //     try {
// // //         const [rows] = await pool.execute('SELECT id, username FROM users');
// // //         res.json(rows);
// // //     } catch (error) {
// // //         console.error('Error fetching users:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });


// // // // Get chat history between two users
// // // app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
// // //     const { user1Id, user2Id } = req.params;
// // //     try {
// // //         const [messages] = await pool.execute(
// // //             `SELECT m.id, m.sender_id, m.receiver_id, m.message_type, m.content, m.timestamp,
// // //                     s.username AS sender_username, r.username AS receiver_username
// // //              FROM messages m
// // //              JOIN users s ON m.sender_id = s.id
// // //              JOIN users r ON m.receiver_id = r.id
// // //              WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
// // //              ORDER BY timestamp ASC`,
// // //             [user1Id, user2Id, user2Id, user1Id]
// // //         );
// // //         res.json(messages);
// // //     } catch (error) {
// // //         console.error('Error fetching messages:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Upload file and send message
// // // app.post('/api/upload-message', upload.single('file'), async (req, res) => {
// // //     const { senderId, receiverId, messageType, textContent } = req.body;
// // //     let content = textContent;

// // //     if (req.file) {
// // //         content = `/uploads/${req.file.filename}`; // Store relative path
// // //     } else if (messageType !== 'text') {
// // //         return res.status(400).json({ message: 'File is required for non-text messages.' });
// // //     }

// // //     try {
// // //         const [result] = await pool.execute(
// // //             'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// // //             [senderId, receiverId, messageType, content]
// // //         );
// // //         const newMessage = {
// // //             id: result.insertId,
// // //             sender_id: parseInt(senderId),
// // //             receiver_id: parseInt(receiverId),
// // //             message_type: messageType,
// // //             content: content,
// // //             timestamp: new Date().toISOString(),
// // //             // In a real app, fetch sender/receiver usernames or pass them from frontend
// // //             sender_username: 'Unknown', // Placeholder
// // //             receiver_username: 'Unknown' // Placeholder
// // //         };

// // //         // Emit message to sender and receiver via Socket.IO
// // //         io.to(senderId).emit('receive_message', newMessage);
// // //         io.to(receiverId).emit('receive_message', newMessage);

// // //         res.status(201).json({ message: 'Message sent successfully', newMessage });
// // //     } catch (error) {
// // //         console.error('Error sending message/uploading file:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });


// // // // --- Socket.IO Real-time Communication ---
// // // const userSockets = new Map(); // Maps userId to Socket.ID

// // // io.on('connection', (socket) => {
// // //     console.log('A user connected:', socket.id);

// // //     socket.on('register_user', (userId) => {
// // //         socket.join(userId); // Join a room named after the user ID
// // //         userSockets.set(userId, socket.id);
// // //         console.log(`User ${userId} registered with socket ${socket.id}`);
// // //     });

// // //     socket.on('send_message', async (data) => {
// // //         const { senderId, receiverId, messageType, content } = data;

// // //         try {
// // //             const [result] = await pool.execute(
// // //                 'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// // //                 [senderId, receiverId, messageType, content]
// // //             );

// // //             const newMessage = {
// // //                 id: result.insertId,
// // //                 sender_id: senderId,
// // //                 receiver_id: receiverId,
// // //                 message_type: messageType,
// // //                 content: content,
// // //                 timestamp: new Date().toISOString(),
// // //                 // You'd want to fetch sender/receiver usernames here for display
// // //             };

// // //             // Emit to the sender's room
// // //             io.to(senderId).emit('receive_message', newMessage);
// // //             // Emit to the receiver's room
// // //             io.to(receiverId).emit('receive_message', newMessage);

// // //         } catch (error) {
// // //             console.error('Error saving message to DB:', error);
// // //         }
// // //     });

// // //     socket.on('disconnect', () => {
// // //         console.log('User disconnected:', socket.id);
// // //         // Remove user from map on disconnect
// // //         for (let [userId, socketId] of userSockets.entries()) {
// // //             if (socketId === socket.id) {
// // //                 userSockets.delete(userId);
// // //                 break;
// // //             }
// // //         }
// // //     });
// // // });


// // // // Start the server
// // // const PORT = process.env.PORT || 5000;
// // // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));













// // // require('dotenv').config();
// // // const express = require('express');
// // // const mysql = require('mysql2/promise');
// // // const http = require('http');
// // // const { Server } = require('socket.io');
// // // const cors = require('cors');
// // // const multer = require('multer');
// // // const path = require('path');
// // // const fs = require('fs');

// // // const app = express();
// // // const server = http.createServer(app);
// // // const io = new Server(server, {
// // //     cors: {
// // //         origin: "http://localhost:3000", // Your React app's origin
// // //         methods: ["GET", "POST"]
// // //     }
// // // });

// // // // Middleware
// // // app.use(cors());
// // // app.use(express.json());
// // // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // // Database Connection Pool
// // // const pool = mysql.createPool({
// // //     host: process.env.DB_HOST,
// // //     user: process.env.DB_USER,
// // //     password: process.env.DB_PASSWORD,
// // //     database: process.env.DB_NAME,
// // //     waitForConnections: true,
// // //     connectionLimit: 10,
// // //     queueLimit: 0
// // // });

// // // // Ensure uploads directory exists
// // // const uploadsDir = path.join(__dirname, 'uploads');
// // // if (!fs.existsSync(uploadsDir)) {
// // //     fs.mkdirSync(uploadsDir);
// // // }

// // // // Multer storage configuration for file uploads
// // // const storage = multer.diskStorage({
// // //     destination: (req, file, cb) => {
// // //         cb(null, 'uploads/');
// // //     },
// // //     filename: (req, file, cb) => {
// // //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// // //         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
// // //     }
// // // });

// // // const upload = multer({ storage: storage });

// // // // --- API Endpoints ---

// // // // User Registration
// // // app.post('/api/register', async (req, res) => {
// // //     const { username, password } = req.body;
// // //     if (!username || !password) {
// // //         return res.status(400).json({ message: 'Username and password are required.' });
// // //     }
// // //     try {
// // //         const [result] = await pool.execute(
// // //             'INSERT INTO users (username, password) VALUES (?, ?)',
// // //             [username, password]
// // //         );
// // //         res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
// // //     } catch (error) {
// // //         if (error.code === 'ER_DUP_ENTRY') {
// // //             return res.status(409).json({ message: 'Username already exists.' });
// // //         }
// // //         console.error('Error registering user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // User Login
// // // app.post('/api/login', async (req, res) => {
// // //     const { username, password } = req.body;
// // //     try {
// // //         const [rows] = await pool.execute(
// // //             'SELECT id, username, password FROM users WHERE username = ?',
// // //             [username]
// // //         );
// // //         if (rows.length === 0) {
// // //             return res.status(401).json({ message: 'Invalid username or password.' });
// // //         }
// // //         const user = rows[0];
// // //         if (password !== user.password) {
// // //             return res.status(401).json({ message: 'Invalid username or password.' });
// // //         }
// // //         res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
// // //     } catch (error) {
// // //         console.error('Error logging in user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Get User by ID
// // // app.get('/api/users/:id', async (req, res) => {
// // //     const userId = req.params.id;
// // //     try {
// // //         const [rows] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [userId]);
// // //         if (rows.length === 0) {
// // //             return res.status(404).json({ message: 'User not found.' });
// // //         }
// // //         res.json(rows[0]);
// // //     } catch (error) {
// // //         console.error('Error fetching user:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Get all users
// // // app.get('/api/users', async (req, res) => {
// // //     try {
// // //         const [rows] = await pool.execute('SELECT id, username FROM users');
// // //         res.json(rows);
// // //     } catch (error) {
// // //         console.error('Error fetching users:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Get chat history between two users
// // // app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
// // //     const { user1Id, user2Id } = req.params;
// // //     try {
// // //         const [messages] = await pool.execute(
// // //             `SELECT m.id, m.sender_id, m.receiver_id, m.message_type, m.content, m.timestamp,
// // //                     s.username AS sender_username, r.username AS receiver_username
// // //              FROM messages m
// // //              JOIN users s ON m.sender_id = s.id
// // //              JOIN users r ON m.receiver_id = r.id
// // //              WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
// // //              ORDER BY timestamp ASC`,
// // //             [user1Id, user2Id, user2Id, user1Id]
// // //         );
// // //         res.json(messages);
// // //     } catch (error) {
// // //         console.error('Error fetching messages:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });

// // // // Upload file and send message
// // // app.post('/api/upload-message', upload.single('file'), async (req, res) => {
// // //     const { senderId, receiverId, messageType, textContent } = req.body;
// // //     let content = textContent;

// // //     if (req.file) {
// // //         content = `/uploads/${req.file.filename}`; // Store relative path
// // //     } else if (messageType !== 'text') {
// // //         return res.status(400).json({ message: 'File is required for non-text messages.' });
// // //     }

// // //     try {
// // //         const [result] = await pool.execute(
// // //             'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// // //             [senderId, receiverId, messageType, content]
// // //         );
// // //         const newMessage = {
// // //             id: result.insertId,
// // //             sender_id: parseInt(senderId),
// // //             receiver_id: parseInt(receiverId),
// // //             message_type: messageType,
// // //             content: content,
// // //             timestamp: new Date().toISOString(),
// // //             // These will be filled on the client-side or we could fetch them here
// // //             sender_username: 'Unknown',
// // //             receiver_username: 'Unknown'
// // //         };

// // //         // Emit message to sender and receiver via Socket.IO
// // //         // We'll emit the full message object, client will enrich usernames
// // //         io.to(senderId).emit('receive_message', newMessage);
// // //         io.to(receiverId).emit('receive_message', newMessage);

// // //         res.status(201).json({ message: 'Message sent successfully', newMessage });
// // //     } catch (error) {
// // //         console.error('Error sending message/uploading file:', error);
// // //         res.status(500).json({ message: 'Server error.' });
// // //     }
// // // });


// // // // --- Socket.IO Real-time Communication ---
// // // // Stores userId -> { socketId: '...', username: '...', isOnline: true }
// // // const onlineUsers = new Map(); // Maps userId to an object containing socketId and username

// // // // Helper to broadcast online status
// // // const broadcastOnlineUsers = () => {
// // //     const usersStatus = Array.from(onlineUsers.entries()).map(([userId, userData]) => ({
// // //         id: parseInt(userId), // Ensure ID is a number
// // //         username: userData.username,
// // //         isOnline: userData.isOnline
// // //     }));
// // //     io.emit('online_users_update', usersStatus);
// // //     console.log('Online users broadcast:', usersStatus);
// // // };


// // // io.on('connection', (socket) => {
// // //     console.log('A user connected:', socket.id);

// // //     socket.on('register_user', async (userId) => {
// // //         socket.join(userId); // Join a room named after the user ID
        
// // //         try {
// // //             const [rows] = await pool.execute('SELECT username FROM users WHERE id = ?', [userId]);
// // //             if (rows.length > 0) {
// // //                 const username = rows[0].username;
// // //                 onlineUsers.set(userId, { socketId: socket.id, username: username, isOnline: true });
// // //                 console.log(`User ${username} (${userId}) registered with socket ${socket.id}`);
// // //                 broadcastOnlineUsers(); // Broadcast updated online list to all connected clients
// // //             } else {
// // //                 console.warn(`User ID ${userId} not found in database during registration.`);
// // //             }
// // //         } catch (error) {
// // //             console.error('Error fetching username for socket registration:', error);
// // //         }
// // //     });

// // //     socket.on('send_message', async (data) => {
// // //         const { senderId, receiverId, messageType, content } = data;

// // //         try {
// // //             const [result] = await pool.execute(
// // //                 'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// // //                 [senderId, receiverId, messageType, content]
// // //             );

// // //             // Fetch sender and receiver usernames for the message object
// // //             const [senderRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [senderId]);
// // //             const senderUsername = senderRows.length > 0 ? senderRows[0].username : 'Unknown';

// // //             const [receiverRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [receiverId]);
// // //             const receiverUsername = receiverRows.length > 0 ? receiverRows[0].username : 'Unknown';

// // //             const newMessage = {
// // //                 id: result.insertId,
// // //                 sender_id: senderId,
// // //                 receiver_id: receiverId,
// // //                 message_type: messageType,
// // //                 content: content,
// // //                 timestamp: new Date().toISOString(),
// // //                 sender_username: senderUsername,
// // //                 receiver_username: receiverUsername
// // //             };

// // //             // Emit to the sender's room
// // //             io.to(senderId).emit('receive_message', newMessage);
// // //             // Emit to the receiver's room
// // //             io.to(receiverId).emit('receive_message', newMessage);

// // //         } catch (error) {
// // //             console.error('Error saving message to DB or fetching usernames:', error);
// // //         }
// // //     });

// // //     socket.on('disconnect', () => {
// // //         console.log('User disconnected:', socket.id);
// // //         let disconnectedUserId = null;
// // //         for (let [userId, userData] of onlineUsers.entries()) {
// // //             if (userData.socketId === socket.id) {
// // //                 disconnectedUserId = userId;
// // //                 onlineUsers.delete(userId);
// // //                 console.log(`User ${userData.username} (${userId}) disconnected.`);
// // //                 break;
// // //             }
// // //         }
// // //         if (disconnectedUserId) {
// // //             broadcastOnlineUsers(); // Broadcast updated online list
// // //         }
// // //     });
// // // });


// // // // Start the server
// // // const PORT = process.env.PORT || 5000;
// // // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));










// // require('dotenv').config();
// // const express = require('express');
// // const mysql = require('mysql2/promise');
// // const http = require('http');
// // const { Server } = require('socket.io');
// // const cors = require('cors');
// // const multer = require('multer');
// // const path = require('path');
// // const fs = require('fs');

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //     cors: {
// //         origin: "http://localhost:3000", // Your React app's origin
// //         methods: ["GET", "POST"]
// //     }
// // });

// // // Middleware
// // app.use(cors());
// // app.use(express.json());
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // Database Connection Pool
// // const pool = mysql.createPool({
// //     host: process.env.DB_HOST,
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     database: process.env.DB_NAME,
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     queueLimit: 0
// // });

// // // Ensure uploads directory exists
// // const uploadsDir = path.join(__dirname, 'uploads');
// // if (!fs.existsSync(uploadsDir)) {
// //     fs.mkdirSync(uploadsDir);
// // }

// // // Multer storage configuration for file uploads
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, 'uploads/');
// //     },
// //     filename: (req, file, cb) => {
// //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
// //     }
// // });

// // const upload = multer({ storage: storage });

// // // --- API Endpoints (No changes needed here for online status) ---
// // // User Registration (Basic - in a real app, hash passwords!)
// // app.post('/api/register', async (req, res) => {
// //     const { username, password } = req.body;
// //     if (!username || !password) {
// //         return res.status(400).json({ message: 'Username and password are required.' });
// //     }
// //     try {
// //         const [result] = await pool.execute(
// //             'INSERT INTO users (username, password) VALUES (?, ?)',
// //             [username, password]
// //         );
// //         res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
// //     } catch (error) {
// //         if (error.code === 'ER_DUP_ENTRY') {
// //             return res.status(409).json({ message: 'Username already exists.' });
// //         }
// //         console.error('Error registering user:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // User Login (Basic - in a real app, use JWTs for authentication)
// // app.post('/api/login', async (req, res) => {
// //     const { username, password } = req.body;
// //     try {
// //         const [rows] = await pool.execute(
// //             'SELECT id, username, password FROM users WHERE username = ?',
// //             [username]
// //         );
// //         if (rows.length === 0) {
// //             return res.status(401).json({ message: 'Invalid username or password.' });
// //         }
// //         const user = rows[0];
// //         // In a real app, compare hashed passwords: bcrypt.compareSync(password, user.password)
// //         if (password !== user.password) {
// //             return res.status(401).json({ message: 'Invalid username or password.' });
// //         }
// //         res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
// //     } catch (error) {
// //         console.error('Error logging in user:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // Get User by ID (for demonstration)
// // app.get('/api/users/:id', async (req, res) => {
// //     const userId = req.params.id;
// //     try {
// //         const [rows] = await pool.execute('SELECT id, username FROM users WHERE id = ?', [userId]);
// //         if (rows.length === 0) {
// //             return res.status(404).json({ message: 'User not found.' });
// //         }
// //         res.json(rows[0]);
// //     } catch (error) {
// //         console.error('Error fetching user:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // Get all users (for selecting receiver)
// // app.get('/api/users', async (req, res) => {
// //     try {
// //         const [rows] = await pool.execute('SELECT id, username FROM users');
// //         res.json(rows);
// //     } catch (error) {
// //         console.error('Error fetching users:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // Get chat history between two users
// // app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
// //     const { user1Id, user2Id } = req.params;
// //     try {
// //         const [messages] = await pool.execute(
// //             `SELECT m.id, m.sender_id, m.receiver_id, m.message_type, m.content, m.timestamp,
// //                     s.username AS sender_username, r.username AS receiver_username
// //              FROM messages m
// //              JOIN users s ON m.sender_id = s.id
// //              JOIN users r ON m.receiver_id = r.id
// //              WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
// //              ORDER BY timestamp ASC`,
// //             [user1Id, user2Id, user2Id, user1Id]
// //         );
// //         res.json(messages);
// //     } catch (error) {
// //         console.error('Error fetching messages:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // Upload file and send message
// // app.post('/api/upload-message', upload.single('file'), async (req, res) => {
// //     const { senderId, receiverId, messageType, textContent } = req.body;
// //     let content = textContent;

// //     if (req.file) {
// //         content = `/uploads/${req.file.filename}`; // Store relative path
// //     } else if (messageType !== 'text') {
// //         return res.status(400).json({ message: 'File is required for non-text messages.' });
// //     }

// //     try {
// //         const [result] = await pool.execute(
// //             'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// //             [senderId, receiverId, messageType, content]
// //         );
// //         const newMessage = {
// //             id: result.insertId,
// //             sender_id: parseInt(senderId),
// //             receiver_id: parseInt(receiverId),
// //             message_type: messageType,
// //             content: content,
// //             timestamp: new Date().toISOString(),
// //             sender_username: 'Unknown', // Placeholder, ideally fetched or passed
// //             receiver_username: 'Unknown' // Placeholder, ideally fetched or passed
// //         };

// //         // Emit message to sender and receiver via Socket.IO
// //         // We'll let the client-side 'receive_message' handler enrich usernames.
// //         io.to(senderId).emit('receive_message', newMessage);
// //         io.to(receiverId).emit('receive_message', newMessage);

// //         res.status(201).json({ message: 'Message sent successfully', newMessage });
// //     } catch (error) {
// //         console.error('Error sending message/uploading file:', error);
// //         res.status(500).json({ message: 'Server error.' });
// //     }
// // });

// // // --- Socket.IO Real-time Communication ---
// // // NEW: A Map to store userId -> socketId, and also to easily get all online user IDs
// // const onlineUsers = new Map(); // Stores userId -> socket.id

// // // Helper function to broadcast online users list
// // const broadcastOnlineUsers = () => {
// //     const onlineUserIds = Array.from(onlineUsers.keys());
// //     io.emit('online_users', onlineUserIds); // Emit to all connected clients
// //     console.log('Currently online users:', onlineUserIds);
// // };

// // io.on('connection', (socket) => {
// //     console.log('A user connected:', socket.id);

// //     // Initial broadcast of online users to the newly connected client
// //     broadcastOnlineUsers();

// //     socket.on('register_user', (userId) => {
// //         // Ensure userId is an integer if it's coming as string from frontend
// //         const parsedUserId = parseInt(userId);
// //         if (isNaN(parsedUserId)) {
// //             console.error('Invalid userId received for registration:', userId);
// //             return;
// //         }

// //         // Leave any existing rooms for this socket before joining
// //         // This is important if a user re-registers or reconnects
// //         // (though client-side disconnect on logout helps prevent this)
// //         socket.rooms.forEach(room => {
// //             if (room !== socket.id) { // Don't leave the default self-room
// //                 socket.leave(room);
// //             }
// //         });

// //         socket.join(parsedUserId); // Join a room named after the user ID
// //         onlineUsers.set(parsedUserId, socket.id); // Map userId to their current socket ID
// //         console.log(`User ${parsedUserId} registered with socket ${socket.id}`);
// //         broadcastOnlineUsers(); // Broadcast updated online list to everyone
// //     });

// //     socket.on('send_message', async (data) => {
// //         const { senderId, receiverId, messageType, content } = data;

// //         try {
// //             const [result] = await pool.execute(
// //                 'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
// //                 [senderId, receiverId, messageType, content]
// //             );

// //             const newMessage = {
// //                 id: result.insertId,
// //                 sender_id: senderId,
// //                 receiver_id: receiverId,
// //                 message_type: messageType,
// //                 content: content,
// //                 timestamp: new Date().toISOString(),
// //                 // Usernames will be enriched on the client-side using the 'users' state
// //             };

// //             // Emit to the sender's room
// //             io.to(senderId).emit('receive_message', newMessage);
// //             // Emit to the receiver's room
// //             io.to(receiverId).emit('receive_message', newMessage);

// //         } catch (error) {
// //             console.error('Error saving message to DB:', error);
// //         }
// //     });

// //     socket.on('disconnect', () => {
// //         console.log('User disconnected:', socket.id);
// //         // Find and remove the user from the onlineUsers map
// //         let disconnectedUserId = null;
// //         for (let [userId, socketId] of onlineUsers.entries()) {
// //             if (socketId === socket.id) {
// //                 disconnectedUserId = userId;
// //                 onlineUsers.delete(userId);
// //                 break;
// //             }
// //         }
// //         if (disconnectedUserId) {
// //             console.log(`User ${disconnectedUserId} went offline.`);
// //             broadcastOnlineUsers(); // Broadcast updated online list to everyone
// //         }
// //     });
// // });


// // // Start the server
// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));











// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2/promise');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database Connection Pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir);
// }

// // Multer storage configuration for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Function to update user's online status in DB and broadcast
// async function updateUserOnlineStatus(userId, isOnline) {
//     try {
//         await pool.execute('UPDATE users SET is_online = ? WHERE id = ?', [isOnline, userId]);
//         console.log(`User ${userId} status updated to ${isOnline ? 'online' : 'offline'}`);
//         // Broadcast the status change to all connected clients
//         io.emit('user_status_change', { userId: userId, isOnline: isOnline });
//     } catch (error) {
//         console.error(`Error updating online status for user ${userId}:, error`);
//     }
// }

// // --- API Endpoints ---

// app.post('/api/register', async (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }
//     try {
//         // When registering, set is_online to false initially
//         const [result] = await pool.execute(
//             'INSERT INTO users (username, password, is_online) VALUES (?, ?, FALSE)',
//             [username, password]
//         );
//         res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ message: 'Username already exists.' });
//         }
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const [rows] = await pool.execute(
//             'SELECT id, username, password FROM users WHERE username = ?',
//             [username]
//         );
//         if (rows.length === 0) {
//             return res.status(401).json({ message: 'Invalid username or password.' });
//         }
//         const user = rows[0];
//         if (password !== user.password) {
//             return res.status(401).json({ message: 'Invalid username or password.' });
//         }

//         // Set user to online upon successful login
//         await updateUserOnlineStatus(user.id, true);

//         res.json({ message: 'Login successful', user: { id: user.id, username: user.username, is_online: true } });
//     } catch (error) {
//         console.error('Error logging in user:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.post('/api/logout', async (req, res) => {
//     const { userId } = req.body;
//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required.' });
//     }
//     try {
//         await updateUserOnlineStatus(userId, false);
//         res.status(200).json({ message: 'Logged out successfully.' });
//     } catch (error) {
//         console.error('Error during logout:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.get('/api/users/:id', async (req, res) => {
//     const userId = req.params.id;
//     try {
//         const [rows] = await pool.execute('SELECT id, username, is_online FROM users WHERE id = ?', [userId]);
//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'User not found.' });
//         }
//         res.json(rows[0]);
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.get('/api/users', async (req, res) => {
//     try {
//         const [rows] = await pool.execute('SELECT id, username, is_online FROM users');
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
//     const { user1Id, user2Id } = req.params;
//     try {
//         const [messages] = await pool.execute(
//             `SELECT m.id, m.sender_id, m.receiver_id, m.message_type, m.content, m.timestamp,
//                     s.username AS sender_username, r.username AS receiver_username
//              FROM messages m
//              JOIN users s ON m.sender_id = s.id
//              JOIN users r ON m.receiver_id = r.id
//              WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
//              ORDER BY timestamp ASC`,
//             [user1Id, user2Id, user2Id, user1Id]
//         );
//         res.json(messages);
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// app.post('/api/upload-message', upload.single('file'), async (req, res) => {
//     const { senderId, receiverId, messageType, textContent } = req.body;
//     let content = textContent;

//     if (req.file) {
//         content = `/uploads/${req.file.filename}`;
//     } else if (messageType !== 'text') {
//         return res.status(400).json({ message: 'File is required for non-text messages.' });
//     }

//     try {
//         const [result] = await pool.execute(
//             'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
//             [senderId, receiverId, messageType, content]
//         );

//         // Fetch sender and receiver usernames for the new message
//         const [senderRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [senderId]);
//         const [receiverRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [receiverId]);

//         const newMessage = {
//             id: result.insertId,
//             sender_id: parseInt(senderId),
//             receiver_id: parseInt(receiverId),
//             message_type: messageType,
//             content: content,
//             timestamp: new Date().toISOString(),
//             sender_username: senderRows[0] ? senderRows[0].username : 'Unknown',
//             receiver_username: receiverRows[0] ? receiverRows[0].username : 'Unknown'
//         };

//         // Emit message to sender and receiver via Socket.IO
//         io.to(senderId).emit('receive_message', newMessage);
//         io.to(receiverId).emit('receive_message', newMessage);

//         res.status(201).json({ message: 'Message sent successfully', newMessage });
//     } catch (error) {
//         console.error('Error sending message/uploading file:', error);
//         res.status(500).json({ message: 'Server error.' });
//     }
// });

// // --- Socket.IO Real-time Communication ---
// const userSockets = new Map(); // Maps userId to Socket.ID

// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('register_user', async (userId) => {
//         socket.join(userId);
//         userSockets.set(userId, socket.id);
//         console.log(`User ${userId} registered with socket ${socket.id}`);
//         // Set user to online when their socket registers
//         await updateUserOnlineStatus(userId, true);
//     });

//     socket.on('disconnect', async () => {
//         console.log('User disconnected:', socket.id);
//         let disconnectedUserId = null;
//         for (let [userId, socketId] of userSockets.entries()) {
//             if (socketId === socket.id) {
//                 disconnectedUserId = userId;
//                 userSockets.delete(userId);
//                 break;
//             }
//         }
//         if (disconnectedUserId) {
//             // Set user to offline when their socket disconnects
//             await updateUserOnlineOnlineStatus(disconnectedUserId, false);
//         }
//     });

//     // You can remove the 'send_message' socket event since file uploads handle message sending
//     // If you want to handle plain text messages via socket.io, keep this:
//     /*
//     socket.on('send_message', async (data) => {
//         const { senderId, receiverId, messageType, content } = data;

//         try {
//             const [result] = await pool.execute(
//                 'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
//                 [senderId, receiverId, messageType, content]
//             );

//             const [senderRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [senderId]);
//             const [receiverRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [receiverId]);

//             const newMessage = {
//                 id: result.insertId,
//                 sender_id: senderId,
//                 receiver_id: receiverId,
//                 message_type: messageType,
//                 content: content,
//                 timestamp: new Date().toISOString(),
//                 sender_username: senderRows[0] ? senderRows[0].username : 'Unknown',
//                 receiver_username: receiverRows[0] ? receiverRows[0].username : 'Unknown'
//             };

//             io.to(senderId).emit('receive_message', newMessage);
//             io.to(receiverId).emit('receive_message', newMessage);

//         } catch (error) {
//             console.error('Error saving message to DB:', error);
//         }
//     });
//     */
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));






require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000"; // Fallback for local dev
const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST"]
    }
});
app.use(cors({ origin: allowedOrigin }));

// Middleware

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // ✅ Add this line
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Function to update user's online status in DB and broadcast
async function updateUserOnlineStatus(userId, isOnline) {
    try {
        await pool.execute('UPDATE users SET is_online = ? WHERE id = ?', [isOnline, userId]);
        console.log(`User ${userId} status updated to ${isOnline ? 'online' : 'offline'}`);
        // Broadcast the status change to all connected clients
        io.emit('user_status_change', { userId: userId, isOnline: isOnline });
    } catch (error) {
        console.error(`Error updating online status for user ${userId}:, error`);
    }
}

// --- API Endpoints ---

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        // When registering, set is_online to false and last_login_at to NULL initially
        const [result] = await pool.execute(
            'INSERT INTO users (username, password, is_online, last_login_at) VALUES (?, ?, FALSE, NULL)',
            [username, password]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, password FROM users WHERE username = ?',
            [username]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const user = rows[0];
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Set user to online and update last_login_at upon successful login
        const now = new Date();
        await pool.execute('UPDATE users SET is_online = TRUE, last_login_at = ? WHERE id = ?', [now, user.id]);
        console.log(`User ${user.id} logged in and status updated.`);
        io.emit('user_status_change', { userId: user.id, isOnline: true });


        res.json({ message: 'Login successful', user: { id: user.id, username: user.username, is_online: true, last_login_at: now } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/logout', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }
    try {
        // When logging out, only update is_online to false. last_login_at remains.
        await updateUserOnlineStatus(userId, false);
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT id, username, is_online, last_login_at FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, username, is_online, last_login_at FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/messages/:user1Id/:user2Id', async (req, res) => {
    const { user1Id, user2Id } = req.params;
    try {
        const [messages] = await pool.execute(
            `SELECT m.id, m.sender_id, m.receiver_id, m.message_type, m.content, m.timestamp,
                    s.username AS sender_username, r.username AS receiver_username
             FROM messages m
             JOIN users s ON m.sender_id = s.id
             JOIN users r ON m.receiver_id = r.id
             WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
             ORDER BY timestamp ASC`,
            [user1Id, user2Id, user2Id, user1Id]
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/upload-message', upload.single('file'), async (req, res) => {
    const { senderId, receiverId, messageType, textContent } = req.body;
    let content = textContent;

    if (req.file) {
        content = `/uploads/${req.file.filename}`;
    } else if (messageType !== 'text') {
        return res.status(400).json({ message: 'File is required for non-text messages.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO messages (sender_id, receiver_id, message_type, content) VALUES (?, ?, ?, ?)',
            [senderId, receiverId, messageType, content]
        );

        // Fetch sender and receiver usernames for the new message
        const [senderRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [senderId]);
        const [receiverRows] = await pool.execute('SELECT username FROM users WHERE id = ?', [receiverId]);

        const newMessage = {
            id: result.insertId,
            sender_id: parseInt(senderId),
            receiver_id: parseInt(receiverId),
            message_type: messageType,
            content: content,
            timestamp: new Date().toISOString(),
            sender_username: senderRows[0] ? senderRows[0].username : 'Unknown',
            receiver_username: receiverRows[0] ? receiverRows[0].username : 'Unknown'
        };

        // Emit message to sender and receiver via Socket.IO
        io.to(senderId).emit('receive_message', newMessage);
        io.to(receiverId).emit('receive_message', newMessage);

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.error('Error sending message/uploading file:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// --- Socket.IO Real-time Communication ---
const userSockets = new Map(); // Maps userId to Socket.ID

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register_user', async (userId) => {
        socket.join(userId);
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
        // If the user's socket registers, it means they are active, so set them online.
        // This implicitly handles setting 'is_online' to true when a user logs in and establishes a socket connection.
        // The 'last_login_at' is handled by the /api/login endpoint.
        await updateUserOnlineStatus(userId, true);
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        let disconnectedUserId = null;
        for (let [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                disconnectedUserId = userId;
                userSockets.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            // Set user to offline when their socket disconnects
            await updateUserOnlineStatus(disconnectedUserId, false);
        }
    });
});


const port = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.status(200).send('Chat Backend API is running!');
});

 server.listen(PORT, () => console.log(`Server running on port ${PORT}`));