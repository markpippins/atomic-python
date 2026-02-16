#!/bin/bash
# Script to run databases locally using Docker Compose

set -e  # Exit on any error

echo "Starting local databases..."

# Start only the databases using docker compose (with space, not docker-compose)
docker compose -f docker-compose-minimal.yml up -d redis mysql

echo "Waiting for databases to be ready..."
sleep 5

# Check if Redis is ready
echo "Checking Redis connection..."
if docker compose -f docker-compose-minimal.yml exec redis redis-cli ping >/dev/null 2>&1; then
    echo "✓ Redis is ready"
else
    echo "✗ Redis is not responding"
    exit 1
fi

# Check if MySQL is ready
echo "Checking MySQL connection..."
if docker compose -f docker-compose-minimal.yml exec mysql mysqladmin ping -u media --password=changeme -h localhost >/dev/null 2>&1; then
    echo "✓ MySQL is ready"
else
    echo "✗ MySQL is not responding"
    exit 1
fi

echo "All databases are running and ready!"
echo "Redis: localhost:6379"
echo "MySQL: localhost:3306"
echo ""
echo "To stop the databases, run: docker compose -f docker-compose-minimal.yml down"