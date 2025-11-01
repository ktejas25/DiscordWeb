@echo off
echo 🎙️  Starting Voice Channel Development Environment
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
  echo ❌ Docker is not running. Please start Docker first.
  exit /b 1
)

echo ✅ Docker is running
echo.

REM Start LiveKit in background
echo 🚀 Starting LiveKit server...
docker run --rm -d --name livekit-dev -p 7880:7880 -p 7881:7881 -p 7882:7882/udp -e LIVEKIT_KEYS="devkey: secret" livekit/livekit-server --dev

timeout /t 3 /nobreak >nul

docker ps | findstr livekit-dev >nul
if errorlevel 1 (
  echo ❌ Failed to start LiveKit server
  exit /b 1
)

echo ✅ LiveKit server started on ws://localhost:7880
echo.
echo 📝 Next steps:
echo    1. Run 'npm run build:server && npm start' in another terminal
echo    2. Run 'npm run dev' in another terminal
echo    3. Open http://localhost:5173 in two browser windows
echo.
echo 🛑 To stop LiveKit: docker stop livekit-dev
