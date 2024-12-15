const multer = require('multer');

// Set up disk storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the folder where files will be saved
        cb(null, 'uploads/'); // Make sure you have this folder or create it
    },
    filename: (req, file, cb) => {
        // You can customize the file name (e.g., add a timestamp for uniqueness)
        cb(null, Date.now() + '-' + file.originalname); // Saves file with a unique name
    }
});

// Filter to allow only certain file types (images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('File format not supported'), false); // Reject the file
    }
};

// Create a multer instance with storage and file filter options
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
