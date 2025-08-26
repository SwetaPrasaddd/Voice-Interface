// client.js
// Real-time Voice Interface for Revolt Motors AI Assistant
// Enhanced with interruption capabilities and better UX

// DOM Elements
const toggleButton = document.getElementById('toggleButton');
const interruptButton = document.getElementById('interruptButton');
const statusDiv = document.getElementById('status');

// State variables
let isListening = false;
let isSpeaking = false;
let webSocket;
let recognition;
let synthesis = window.speechSynthesis;
let currentVoice;
let currentUtterance = null;

// Initialize Speech Recognition
const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('Speech recognition started');
            if (!isSpeaking) {
                statusDiv.textContent = '🎤 Listening... Ask me about Revolt Motors!';
            }
        };

        recognition.onresult = (event) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                }
            }

            if (finalTranscript.trim()) {
                console.log('User said:', finalTranscript);

                // If AI is speaking, interrupt it
                if (isSpeaking) {
                    interruptAI();
                }

                statusDiv.textContent = '🤔 Thinking...';

                // Send text to server
                if (webSocket && webSocket.readyState === WebSocket.OPEN) {
                    webSocket.send(JSON.stringify({
                        type: 'text_message',
                        text: finalTranscript.trim()
                    }));
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'aborted') {
                statusDiv.textContent = `❌ Error: ${event.error}. Click to try again.`;
                stopListening();
            }
        };

        recognition.onend = () => {
            console.log('Speech recognition ended');
            if (isListening && !isSpeaking) {
                // Restart recognition if we're still supposed to be listening and not speaking
                setTimeout(() => {
                    if (isListening && !isSpeaking) {
                        recognition.start();
                    }
                }, 100);
            }
        };

        return true;
    } else {
        console.error('Speech recognition not supported');
        statusDiv.textContent = '❌ Speech recognition not supported in this browser';
        return false;
    }
};

// Initialize Text-to-Speech
const initSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
        // Wait for voices to be loaded
        const setVoice = () => {
            const voices = synthesis.getVoices();
            // Prefer a natural-sounding English voice
            currentVoice = voices.find(voice =>
                voice.lang.startsWith('en') &&
                (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Female'))
            ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

            console.log('Selected voice:', currentVoice?.name);
        };

        if (synthesis.getVoices().length > 0) {
            setVoice();
        } else {
            synthesis.onvoiceschanged = setVoice;
        }

        return true;
    } else {
        console.error('Speech synthesis not supported');
        return false;
    }
};

// Interrupt AI speech
const interruptAI = () => {
    console.log('Interrupting AI speech');
    if (synthesis && isSpeaking) {
        synthesis.cancel();
        isSpeaking = false;
        currentUtterance = null;
        interruptButton.style.display = 'none';

        // Resume listening immediately after interruption
        if (isListening && recognition) {
            setTimeout(() => {
                if (isListening) {
                    recognition.start();
                }
            }, 100);
        }
    }
};

// Speak AI response
const speakText = (text) => {
    if (synthesis && currentVoice) {
        // Stop any current speech
        synthesis.cancel();
        isSpeaking = true;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = currentVoice;
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;

        currentUtterance = utterance;
        interruptButton.style.display = 'inline-block';

        utterance.onstart = () => {
            statusDiv.textContent = '🗣️ Rev is speaking... (you can interrupt anytime)';
            isSpeaking = true;

            // Stop recognition while speaking
            if (recognition) {
                recognition.stop();
            }
        };

        utterance.onend = () => {
            console.log('Speech synthesis ended');
            isSpeaking = false;
            currentUtterance = null;
            interruptButton.style.display = 'none';

            if (isListening) {
                statusDiv.textContent = '🎤 Listening... Ask me anything else!';
                // Resume recognition after speaking
                setTimeout(() => {
                    if (isListening && recognition) {
                        recognition.start();
                    }
                }, 500);
            } else {
                statusDiv.textContent = 'Click "Start Chat" to begin';
            }
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            isSpeaking = false;
            currentUtterance = null;
            interruptButton.style.display = 'none';
            statusDiv.textContent = '❌ Error with speech playback';
        };

        synthesis.speak(utterance);
    }
};

// WebSocket connection
const connectWebSocket = () => {
    const wsUrl = `ws://${window.location.host}`;
    webSocket = new WebSocket(wsUrl);

    webSocket.onopen = () => {
        console.log('Connected to server');
        statusDiv.textContent = '🔗 Connected! Starting voice recognition...';

        // Start speech recognition
        if (recognition) {
            setTimeout(() => {
                recognition.start();
            }, 500);
        }
    };

    webSocket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'connection_established':
                    console.log('Server message:', data.message);
                    break;

                case 'ai_response':
                    console.log('AI response:', data.text);
                    speakText(data.text);
                    break;

                case 'error':
                    console.error('Server error:', data.message);
                    statusDiv.textContent = `❌ Error: ${data.message}`;
                    break;

                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    webSocket.onclose = () => {
        console.log('WebSocket connection closed');
        if (isListening) {
            stopListening();
            statusDiv.textContent = '🔌 Connection lost. Click to restart.';
        }
    };

    webSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        statusDiv.textContent = '❌ Connection error. Click to try again.';
        stopListening();
    };
};

// Start listening
const startListening = () => {
    if (!recognition) {
        if (!initSpeechRecognition()) {
            return;
        }
    }

    if (!synthesis) {
        if (!initSpeechSynthesis()) {
            return;
        }
    }

    isListening = true;
    toggleButton.innerHTML = '<span class="mic-icon">🔴</span>Stop Chat';
    toggleButton.classList.add('recording');
    statusDiv.textContent = '🔗 Connecting to Rev...';

    connectWebSocket();
};

// Stop listening
const stopListening = () => {
    isListening = false;
    isSpeaking = false;
    toggleButton.innerHTML = '<span class="mic-icon">🎤</span>Start Chat';
    toggleButton.classList.remove('recording');
    interruptButton.style.display = 'none';
    statusDiv.textContent = '👋 Chat ended. Click "Start Chat" to talk with Rev again!';

    // Stop speech recognition
    if (recognition) {
        recognition.stop();
    }

    // Stop speech synthesis
    if (synthesis) {
        synthesis.cancel();
        currentUtterance = null;
    }

    // Close WebSocket
    if (webSocket) {
        webSocket.close();
        webSocket = null;
    }
};

// Toggle chat function
const toggleChat = () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
};

// Initialize when page loads
window.addEventListener('load', () => {
    initSpeechRecognition();
    initSpeechSynthesis();

    // Add click listeners
    toggleButton.addEventListener('click', toggleChat);
    interruptButton.addEventListener('click', interruptAI);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && event.ctrlKey) {
            event.preventDefault();
            toggleChat();
        } else if (event.code === 'Escape' && isSpeaking) {
            event.preventDefault();
            interruptAI();
        }
    });

    console.log('Revolt Motors Voice Assistant initialized');
    console.log('Keyboard shortcuts: Ctrl+Space to toggle chat, Escape to interrupt');
});
