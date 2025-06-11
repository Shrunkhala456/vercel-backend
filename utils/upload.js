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


// IMPORTANT NOTE FOR DEPLOYMENT:
// The current file upload setup (multer with diskStorage) will only work reliably in a
// persistent server environment (like a traditional VM or local development).
// Vercel serverless functions have an ephemeral filesystem. Any files saved to
// the '/uploads' directory will be lost after the function invocation finishes
// or when the function instance is reaped. They also won't be accessible by
// other function instances.
// FOR PRODUCTION DEPLOYMENT, you MUST integrate a cloud storage solution
// (e.g., AWS S3, Google Cloud Storage, Cloudinary, DigitalOcean Spaces, etc.)
// to store and serve uploaded files persistently.