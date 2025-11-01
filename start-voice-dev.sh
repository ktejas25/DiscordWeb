#!/bin/bash

echo "🎙️  Starting Voice Channel Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

echo "✅ Docker is running"
echo ""

# Start LiveKit in background
echo "🚀 Starting LiveKit server..."
docker run --rm -d --name livekit-dev \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 7882:7882/udp \
  -e LIVEKIT_KEYS="devkey: secret" \
  livekit/livekit-server --dev

sleep 3

if docker ps | grep -q livekit-dev; then
  echo "✅ LiveKit server started on ws://localhost:7880"
else
  echo "❌ Failed to start LiveKit server"
  exit 1
fi

echo ""
echo "📝 Next steps:"
echo "   1. Run 'npm run build:server && npm start' in another terminal"
echo "   2. Run 'npm run dev' in another terminal"
echo "   3. Open http://localhost:5173 in two browser windows"
echo ""
echo "🛑 To stop LiveKit: docker stop livekit-dev"
