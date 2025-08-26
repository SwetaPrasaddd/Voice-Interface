// server.js
// Real-time Voice Interface for Revolt Motors using Gemini API
// This implementation uses speech-to-text and text-to-speech to simulate Live API functionality

require('dotenv').config();

const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuration
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_AI_API_KEY;

// Check if API key is provided
if (!API_KEY) {
    console.error('❌ ERROR: GOOGLE_AI_API_KEY environment variable is required!');
    console.error('Please create a .env file with your Google AI Studio API key:');
    console.error('GOOGLE_AI_API_KEY=your_api_key_here');
    process.exit(1);
}

// Model Configuration
const MODEL_NAME = process.env.MODEL_NAME || "gemini-1.5-flash";
const SYSTEM_INSTRUCTIONS = `You are Rev, a friendly and knowledgeable voice assistant for Revolt Motors. 

Key guidelines:
- Only answer questions about Revolt Motors, electric motorcycles, and electric vehicles
- Keep responses conversational and under 50 words for voice interaction
- Be enthusiastic about electric mobility and Revolt's products
- If asked about other topics, politely redirect to Revolt Motors

Revolt Motors key information:
- Leading electric motorcycle manufacturer in India
- Popular models: RV400, RV1, RV1+
- Focus on sustainable transportation and electric mobility
- Offers smart connectivity features and fast charging
- Committed to reducing pollution through electric vehicles`;

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static('public'));

// Initialize WebSocket server
const wss = new WebSocketServer({ server });

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket server.');

    // Handle messages from client
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === 'text_message') {
                console.log('Received text message:', data.text);

                // Get Gemini model
                const model = genAI.getGenerativeModel({
                    model: MODEL_NAME,
                    systemInstruction: SYSTEM_INSTRUCTIONS,
                });

                // Generate response
                const result = await model.generateContent(data.text);
                const response = result.response.text();

                console.log('Gemini response:', response);

                // Send response back to client
                ws.send(JSON.stringify({
                    type: 'ai_response',
                    text: response
                }));
            }
        } catch (error) {
            console.error('Error processing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to process your message'
            }));
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        console.log('Client disconnected.');
    });

    // Handle WebSocket errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'Connected to Revolt Motors AI Assistant'
    }));
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Open http://localhost:3000 in your browser to start chatting!');
});
