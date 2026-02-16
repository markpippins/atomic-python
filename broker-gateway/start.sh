#!/bin/bash

# Start script for Python Broker Gateway
# This script starts the FastAPI-based broker gateway service

echo "🚀 Starting Python Broker Gateway"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
required_packages=("fastapi" "uvicorn" "pydantic" "httpx")
missing_packages=()

for package in "${required_packages[@]}"; do
    if ! python3 -c "import $package" &> /dev/null; then
        missing_packages+=("$package")
    fi
done

if [ ${#missing_packages[@]} -ne 0 ]; then
    echo "❌ Required packages not installed: ${missing_packages[*]}"
    echo "Please install them using: pip install -r requirements.txt"
    exit 1
fi

echo "✅ Environment check passed"
echo ""

# Set default environment variables if not already set
export SERVICE_REGISTRY_URL=${SERVICE_REGISTRY_URL:-"http://localhost:8085/api/registry"}
export SERVICE_HOST=${SERVICE_HOST:-"localhost"}
export PORT=${PORT:-"8000"}

echo "🔧 Using configuration:"
echo "   • Service Registry URL: $SERVICE_REGISTRY_URL"
echo "   • Service Host: $SERVICE_HOST"
echo "   • Port: $PORT"
echo ""

echo "📊 Starting broker gateway service..."
echo "💡 Press Ctrl+C to stop the service"
echo ""

# Start the broker gateway using uvicorn
python3 -m uvicorn app.main:app --host $SERVICE_HOST --port $PORT --reload