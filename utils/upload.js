// server/utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Node.js file system module

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Files will be stored in server/uploads/
    },
    filename: (req, file, cb) => {
        // Use a unique filename to prevent conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    // Allowed mime types
    const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', // Images
        'application/pdf', // PDF
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/plain', // .txt
        'audio/mpeg', 'audio/wav', // Audio
        'video/mp4', 'video/quicktime', // Video
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 25 // 25MB file size limit
    }
});

module.exports = upload;