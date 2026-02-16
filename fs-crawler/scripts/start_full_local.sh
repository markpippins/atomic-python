#!/bin/bash
# Script to run the complete fs-crawler application with local databases

set -e  # Exit on any error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Starting fs-crawler with local databases..."

# Start databases in the project directory
echo "Starting local databases..."
cd "$PROJECT_DIR"
docker compose -f docker-compose-minimal.yml up -d redis mysql

echo "Waiting for databases to be ready..."
sleep 8

# Check if Redis is ready
echo "Checking Redis connection..."
if docker compose -f docker-compose-minimal.yml exec redis redis-cli ping >/dev/null 2>&1; then
    echo "✓ Redis is ready"
else
    echo "✗ Redis is not responding"
    docker compose -f docker-compose-minimal.yml logs redis
    exit 1
fi

# Check if MySQL is ready
echo "Checking MySQL connection..."
if docker compose -f docker-compose-minimal.yml exec mysql mysqladmin ping -u media --password=changeme -h localhost >/dev/null 2>&1; then
    echo "✓ MySQL is ready"
else
    echo "✗ MySQL is not responding"
    docker compose -f docker-compose-minimal.yml logs mysql
    exit 1
fi

echo "All databases are running and ready!"

# Start the application
echo ""
echo "Starting fs-crawler application..."
cd "$PROJECT_DIR/app"

# Activate virtual environment
source "$PROJECT_DIR/venv/bin/activate"

# Set environment variables for local database connections
export REDIS_URL="redis://localhost:6379"
export MONGODB_URL="mongodb://localhost:27017"  # We're not running MongoDB here, but keeping for compatibility
export MYSQL_URL="mysql://media:changeme@localhost:3306/media"
export MONGODB_DATABASE="media_metadata"
export LOG_LEVEL="INFO"

echo "Starting application on http://0.0.0.0:8000"
echo "Application logs will appear below:"
echo "Press Ctrl+C to stop everything"
echo "========================================="

# Run the application
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Cleanup function to stop databases when script exits
cleanup() {
    echo ""
    echo "Stopping databases..."
    cd "$PROJECT_DIR"
    docker compose -f docker-compose-minimal.yml down
}

trap cleanup EXIT INT TERM