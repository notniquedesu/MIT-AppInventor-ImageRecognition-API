#!/bin/bash

# Quick Start Guide for Image Recognition API

echo "🚀 Image Recognition API - Quick Start"
echo "======================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎯 Setup complete! To get started:"
echo ""
echo "1️⃣  Start the API server:"
echo "   cd backend"
echo "   npm start"
echo ""
echo "2️⃣  In another terminal, test the API:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "3️⃣  Try object detection:"
echo "   cd scripts"
echo "   npm install"
echo "   node client.js detect ../test-image.jpg"
echo ""
echo "4️⃣  Build extension (.aix file):"
echo "   cd scripts"
echo "   npm run build-aix"
echo ""
echo "5️⃣  Use in MIT App Inventor:"
echo "   - Import ImageRecognition.aix"
echo "   - Set ServerUrl to http://your-ip:5000"
echo "   - Use component blocks in your app"
echo ""
echo "📚 Documentation:"
echo "   - README: ./docs/README.md"
echo "   - Installation: ./docs/INSTALLATION.md"
echo "   - Examples: ./docs/EXAMPLES.md"
echo "   - API: ./docs/API.md"
echo ""
