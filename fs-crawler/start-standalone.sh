#!/bin/bash

# Standalone startup script for Media Metadata Service (without Docker)
# Assumes backend services (MongoDB, Redis, MySQL) are already running

set -e  # Exit on any error

echo "🚀 Starting Media Metadata Service (Standalone Mode)"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
MISSING_DEPS=()

if ! command_exists python3; then
    MISSING_DEPS+=("python3")
fi

if ! command_exists pip; then
    MISSING_DEPS+=("pip")
fi

if ! command_exists npm; then
    MISSING_DEPS+=("npm")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo "❌ Missing required dependencies: ${MISSING_DEPS[*]}"
    echo "Please install them before proceeding."
    exit 1
fi

echo "✅ Dependencies check passed"

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to check if a port is in use
check_port() {
    local port=$1
    if command_exists nc; then
        # Use netcat if available - returns 0 if port IS in use
        nc -z localhost $port
        return $?
    elif command_exists lsof; then
        # Use lsof as fallback - returns 0 if port is in use
        lsof -Pi :$port -sTCP:LISTEN -t >/dev/null
        return $?
    elif command_exists ss; then
        # Use ss as another fallback - returns 0 if port is in use
        ss -tlnp | grep -q ":$port "
        return $?
    else
        # If no utility is available, return 1 (meaning port is not in use)
        return 1
    fi
}

# Check if port 8004 is already in use
if check_port 8004; then
    echo "❌ Port 8004 is already in use. Please stop the existing service first."
    echo "💡 Tip: You can find the process using the port with: lsof -i :8004"
    exit 1
fi

# Start the backend API in the background
echo "🔌 Starting API server (port 8004)..."
# Use the test_venv which has all required dependencies
nohup ./test_venv/bin/python3 run_server.py > logs/api.log 2>&1 &
API_PID=$!

# Wait a moment for the API to start
sleep 3

# Check if API is running
if kill -0 $API_PID 2>/dev/null; then
    echo "✅ API server started successfully (PID: $API_PID)"
    echo "   • API:              http://localhost:8004"
    echo "   • API Docs:         http://localhost:8004/docs"
    echo "   • System Status:    http://localhost:8004/system/status"
else
    echo "❌ Failed to start API server"
    exit 1
fi

# Install and start the frontend UI
echo "🌐 Setting up and starting UI (port 3000)..."

# Check if port 3000 is already in use
if check_port 3000; then
    echo "❌ Port 3000 is already in use. Please stop the existing UI service first."
    echo "💡 Tip: You can find the process using the port with: lsof -i :3000"
    exit 1
fi

# Use physical path to avoid symlink resolution issues (e.g., /mnt/media1)
SCRIPT_DIR="$(pwd -P)"
cd ui
UI_DIR="$(pwd -P)"

# Install Node.js dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Start the UI in the background using physical path
# Use a different approach for the UI since npm run dev might not work well with nohup
cd "$UI_DIR"
PWD="$UI_DIR" npm run dev > "$SCRIPT_DIR/logs/ui.log" 2>&1 &
UI_PID=$!
cd "$SCRIPT_DIR"

# Wait a moment for the UI to start
sleep 5

# Check if UI is running
if kill -0 $UI_PID 2>/dev/null; then
    echo "✅ UI server started successfully (PID: $UI_PID)"
    echo "   • Web UI:           http://localhost:3000"
else
    echo "⚠️  UI server may still be starting up"
    echo "   • Web UI:           http://localhost:3000"
fi

echo ""
echo "🎉 Services started successfully!"
echo ""
echo "📊 Access points:"
echo "   • Web UI:           http://localhost:3000"
echo "   • API:              http://localhost:8004"
echo "   • API Docs:         http://localhost:8004/docs"
echo "   • System Status:    http://localhost:8004/system/status"
echo ""
echo "📋 Process IDs:"
echo "   • API PID:          $API_PID"
echo "   • UI PID:           $UI_PID"
echo ""
echo "📝 Useful commands:"
echo "   • View API logs:    tail -f logs/api.log"
echo "   • View UI logs:     tail -f logs/ui.log"
echo "   • Stop services:    kill $API_PID $UI_PID"
echo ""
echo "💡 Note: Make sure MongoDB (port 27017), Redis (port 6379), and MySQL (port 3306) are running"
echo "   before starting this service. Check app/config.py for connection details."
echo ""

# Keep the script running
wait $API_PID $UI_PID