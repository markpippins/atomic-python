#!/bin/bash
# Script to run the fs-crawler application with external MongoDB

set -e  # Exit on any error

echo "Starting fs-crawler application with external MongoDB..."

# Check if we're in the correct directory
if [ ! -f "app/main.py" ]; then
    echo "Error: app/main.py not found. Please run this script from the fs-crawler directory."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found. Please create it first with:"
    echo "  python -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Set environment variables for database connections
# Using external MongoDB at 172.16.30.32
export REDIS_URL="redis://localhost:6379"
export MONGODB_URL="mongodb://mongoUser:somePassword@172.16.30.32:27017"
export MYSQL_URL="mysql://media:changeme@localhost:3306/media"
export MONGODB_DATABASE="media_metadata"
export LOG_LEVEL="INFO"

echo "Environment variables set for external MongoDB connection"

# Change to the app directory to run the application
cd app

echo "Starting application on http://0.0.0.0:8000"
echo "Connecting to MongoDB at 172.16.30.32:27017"
echo "Press Ctrl+C to stop"

# Run the application
exec python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload