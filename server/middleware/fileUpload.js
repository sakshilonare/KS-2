const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./config/cloudinary');

// Set up multer with Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder name in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'], // Allowed file types
    },
});

const fileupload = multer({ storage: storage });

module.exports = fileupload;
