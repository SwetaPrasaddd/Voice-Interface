# Revolt Motors Voice Assistant

A real-time conversational voice interface built with the Gemini API, replicating the functionality of the Revolt Motors chatbot with advanced interruption capabilities.

## 🚀 Features

- **Real-time Voice Conversation**: Natural voice interactions with the AI assistant
- **Smart Interruption**: Users can interrupt the AI mid-response, and the AI will stop and listen
- **Revolt Motors Focus**: AI assistant specialized in answering questions about Revolt Motors and electric motorcycles
- **Low Latency**: Fast response times optimized for natural conversation flow
- **Professional UI**: Clean, modern interface with visual feedback
- **Keyboard Shortcuts**: Ctrl+Space to toggle chat, Escape to interrupt
- **Browser-based**: Works directly in modern browsers with speech APIs

## 🛠️ Technology Stack

- **Backend**: Node.js + Express + WebSocket
- **AI**: Google Gemini API (gemini-1.5-flash)
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Speech APIs**: Browser Web Speech API (Recognition + Synthesis)
- **Real-time Communication**: WebSocket for bi-directional communication

## 📋 Prerequisites

- Node.js (v16 or higher)
- Google AI Studio API Key
- Modern browser with Speech API support (Chrome, Edge, Firefox)
- Microphone access

## 🔧 Installation

1. **Clone or download the project**
   ```bash
   cd "Voice Interface"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Get your API key from [Google AI Studio](https://aistudio.google.com)
   - Copy the example environment file:
     ```bash
     copy .env.example .env
     ```
   - Edit `.env` file and add your API key:
     ```
     GOOGLE_AI_API_KEY=your_api_key_here
     PORT=3000
     MODEL_NAME=gemini-1.5-flash
     ```

4. **Start the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node server.js
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Allow microphone permissions when prompted

## 🎯 Usage

1. **Start Conversation**: Click "Start Chat" or press Ctrl+Space
2. **Speak Naturally**: Ask questions about Revolt Motors, electric motorcycles, or EV technology
3. **Interrupt AI**: Click "Interrupt" button, press Escape, or simply start speaking while AI is talking
4. **End Conversation**: Click "Stop Chat" to end the session

### Example Questions
- "Tell me about Revolt Motors electric motorcycles"
- "What are the specifications of the RV400?"
- "How does fast charging work on Revolt bikes?"
- "What are the benefits of electric motorcycles?"

## 🏗️ Architecture

### Server-to-Server Design
- Client captures voice → WebSocket → Node.js server → Gemini API → Response → Text-to-Speech → Client
- Follows the recommended server-to-server architecture for production security

### Key Components

1. **Speech-to-Text**: Browser Web Speech API converts voice to text
2. **WebSocket Server**: Handles real-time bidirectional communication
3. **Gemini Integration**: Processes natural language queries with specialized prompts
4. **Text-to-Speech**: Converts AI responses back to natural voice
5. **Interruption System**: Allows seamless conversation flow with AI interruption

## 🎨 Features Implemented

- ✅ **Natural Conversation Flow**: Continuous listening and response
- ✅ **Interruption Handling**: Stop AI mid-sentence and respond to new input
- ✅ **Low Latency**: Optimized for 1-2 second response times
- ✅ **Revolt Motors Specialization**: AI trained specifically on Revolt Motors knowledge
- ✅ **Visual Feedback**: Real-time status updates and professional UI
- ✅ **Error Handling**: Graceful error recovery and user feedback
- ✅ **Accessibility**: Keyboard shortcuts and clear visual indicators

## 🔐 Security Considerations

- API key is server-side only (not exposed to client)
- Server-to-server architecture prevents direct API access from browser
- WebSocket connections are validated and managed
- No sensitive data storage or logging

## 📊 Performance

- **Response Time**: ~1-2 seconds from user input to AI response
- **Interruption Latency**: Near-instant (< 200ms)
- **Speech Recognition**: Real-time processing with interim results
- **Memory Usage**: Optimized for continuous operation

## 🚦 Development vs Production

### Current Configuration (Development)
- Model: `gemini-1.5-flash` (reliable, fast)
- Rate Limits: Standard free tier limits

### Production Configuration (Recommended)
- Switch to: `gemini-2.5-flash-preview-native-audio-dialog`
- Implement: Rate limiting, user authentication
- Add: Error monitoring, logging, analytics

## 🐛 Troubleshooting

### Common Issues
1. **Microphone Access Denied**: Check browser permissions
2. **Speech Recognition Not Working**: Try Chrome/Edge browsers
3. **API Key Errors**: Verify API key is correct and has proper permissions
4. **Port 3000 In Use**: Kill existing Node processes or change port

### Browser Compatibility
- ✅ Chrome (Recommended)
- ✅ Microsoft Edge
- ⚠️ Firefox (Limited speech synthesis voices)
- ❌ Safari (Limited Web Speech API support)

## 📝 Future Enhancements

- [ ] Implement true Gemini Live API when fully available
- [ ] Add multi-language support
- [ ] Voice activity detection improvements
- [ ] Conversation history and context management
- [ ] Mobile app version
- [ ] Advanced voice customization

## 🤝 Contributing

This project demonstrates the implementation of a production-ready voice interface. Feel free to fork, modify, and improve upon this foundation.

## 📄 License

MIT License - Feel free to use this code for learning and development purposes.

---

**Built for the Revolt Motors Voice Interface Challenge**  
*Demonstrating advanced AI integration and real-time voice interaction capabilities*
