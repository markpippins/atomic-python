#!/bin/bash

# Start script for FS Crawler (Media Metadata Service)
# This script starts the FastAPI-based media metadata indexing service

echo "🚀 Starting FS Crawler (Media Metadata Service)"
echo ""

# Activate virtual environment
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "⚠️  Virtual environment not found, using system Python"
fi
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    exit 1
fi

# Check if required packages are installed
required_packages=("fastapi" "uvicorn" "motor" "redis" "sqlalchemy" "pydantic" "structlog")
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

# Check if required environment variables are set or use defaults
export MONGODB_URL=${MONGODB_URL:-"mongodb://172.16.30.46:27017"}
export REDIS_URL=${REDIS_URL:-"redis://localhost:6379"}
export MYSQL_URL=${MYSQL_URL:-"mysql://media:changeme@localhost:3307/media"}
export MONGODB_DATABASE=${MONGODB_DATABASE:-"media_metadata"}
export FS_CRAWLER_PORT=${FS_CRAWLER_PORT:-"8000"}

echo "🔧 Using configuration:"
echo "   • MongoDB URL: $MONGODB_URL"
echo "   • MongoDB Database: $MONGODB_DATABASE"
echo "   • Redis URL: $REDIS_URL"
echo "   • MySQL URL: $MYSQL_URL"
echo "   • Port: $FS_CRAWLER_PORT"
echo ""

echo "💡 Note: This service requires MongoDB, Redis, and MySQL to be running."
echo "   If you don't have these services running, consider using Docker:"
echo "   docker-compose up -d"
echo ""

echo "📊 Starting FS Crawler service..."
echo "💡 Press Ctrl+C to stop the service"
echo ""

# Load environment variables from .env.local if it exists
if [ -f "../.env.local" ]; then
    export $(grep -v '^#' ../.env.local | xargs)
    echo "✅ Loaded environment variables from .env.local"
fi

# Start the FS crawler service using uvicorn
cd app && python3 -m uvicorn main:app --host "0.0.0.0" --port $FS_CRAWLER_PORT --reload