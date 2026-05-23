// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const uploadDirs = ['uploads/images', 'uploads/videos'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'courseImage' || file.fieldname === 'instructorImage') {
            cb(null, 'uploads/images/');
        } else if (file.fieldname.includes('videoFile')) {
            cb(null, 'uploads/videos/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const cleanFieldname = file.fieldname.replace(/[\[\]\\/]/g, '_');
        cb(null, cleanFieldname + '-' + uniqueSuffix + ext);
    }
});



const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB for videos
});

module.exports = upload;