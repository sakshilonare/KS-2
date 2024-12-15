// routes/chatRoute.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { sendMessageToChatbot, processAudioFile } = require('../controller/chatController');

// File upload middleware (Multer)
const upload = multer({ dest: 'uploads/' });

// Create a router for chatbot-related routes
const router = express.Router();

// Route for chatbot messages
router.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const response = await sendMessageToChatbot(message);
        return res.json({ response });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Something went wrong!' });
    }
});

// Route for uploading and processing audio files
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
    const audioFilePath = path.join(__dirname, '../', req.file.path);
    console.log('Uploaded file:', req.file);
    try {
        const response = await processAudioFile(audioFilePath);

        // Clean up temporary file
        fs.unlinkSync(audioFilePath);

        // Send the processed result back to the frontend
        res.json({
            success: true,
            message: 'Audio processed successfully!',
            response: response,
        });
    } catch (error) {
        console.error('Error processing audio:', error.message);
        res.status(500).json({ success: false, message: 'Audio processing failed.' });
    }
});

module.exports = router;
