@echo off
echo ==============================================
echo   Revolt Motors Voice Assistant Setup
echo ==============================================
echo.

REM Check if .env file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo.
    echo Please create a .env file with your API key:
    echo 1. Copy .env.example to .env
    echo 2. Edit .env and add your Google AI Studio API key
    echo.
    echo Example:
    echo GOOGLE_AI_API_KEY=your_actual_api_key_here
    echo PORT=3000
    echo MODEL_NAME=gemini-1.5-flash
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Setup complete! Starting server...
echo.
echo 🌐 Open http://localhost:3000 in your browser
echo 🎤 Make sure to allow microphone permissions
echo 🏍️ Ask questions about Revolt Motors!
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js
