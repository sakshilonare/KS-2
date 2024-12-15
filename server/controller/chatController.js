// chatController.js
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const { GoogleAIFileManager, FileState } = require('@google/generative-ai/server');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};

const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// Initialize Google AI File Manager
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// Initialize the chatbot
let chat;
async function initializeChatbot() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = await genAI.getGenerativeModel({ model: process.env.MODEL_NAME });
    chat = model.startChat({
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
        history: [],
    });
}
initializeChatbot();

// Function to send a message to the chatbot
async function sendMessageToChatbot(message) {
    try {
        const result = await chat.sendMessage(message);
        if (result.error) {
            throw new Error(result.error.message);
        }
        return result.response.text();
    } catch (error) {
        throw new Error('Error sending message: ' + error.message);
    }
}

// Function to process the uploaded audio and generate a response
async function processAudioFile(filePath) {
    try {
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType: 'audio/mp3',
            displayName: 'Uploaded Audio Sample',
        });

        let file = await fileManager.getFile(uploadResult.file.name);
        while (file.state === FileState.PROCESSING) {
            console.log('Processing audio...');
            await new Promise((resolve) => setTimeout(resolve, 10000));
            file = await fileManager.getFile(uploadResult.file.name);
        }

        if (file.state === FileState.FAILED) {
            throw new Error('Audio processing failed.');
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([
            "Give me the detailed answer for whatever question is asked in the audio. Provide the answer in the language the question is asked in the audio.",
            {
                fileData: {
                    fileUri: uploadResult.file.uri,
                    mimeType: uploadResult.file.mimeType,
                },
            },
        ]);

        return result.response.text();
    } catch (error) {
        throw new Error('Error processing audio: ' + error.message);
    }
}

module.exports = {
    sendMessageToChatbot,
    processAudioFile,
};
