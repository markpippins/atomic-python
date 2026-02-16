#!/bin/bash

# Start script for FS Crawler Broker Adapter
# This script starts the FastAPI-based adapter that makes fs-crawler compatible with the broker system

echo "🚀 Starting FS Crawler Broker Adapter"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
required_packages=("fastapi" "uvicorn" "httpx" "pydantic" "structlog")
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
export FS_CRAWLER_URL=${FS_CRAWLER_URL:-"http://localhost:8000"}
export HOST_SERVER_URL=${HOST_SERVER_URL:-"http://localhost:8085"}
export ADAPTER_PORT=${ADAPTER_PORT:-"8001"}
export ADAPTER_HOST=${ADAPTER_HOST:-"localhost"}

echo "🔧 Using configuration:"
echo "   • FS Crawler URL: $FS_CRAWLER_URL"
echo "   • Host Server URL: $HOST_SERVER_URL"
echo "   • Adapter Port: $ADAPTER_PORT"
echo "   • Adapter Host: $ADAPTER_HOST"
echo ""

echo "💡 Note: This adapter requires the FS Crawler service to be running at $FS_CRAWLER_URL"
echo "   Make sure to start the fs-crawler service first."
echo ""

echo "📊 Starting FS Crawler adapter service..."
echo "💡 Press Ctrl+C to stop the service"
echo ""

# Start the adapter service using uvicorn
python3 -m uvicorn adapter:app --host $ADAPTER_HOST --port $ADAPTER_PORT --reload