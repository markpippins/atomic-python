#!/bin/bash
# Script to run local databases (Redis and MySQL) using Docker Compose
# Note: MongoDB is expected to be available at 172.16.30.46

set -e  # Exit on any error

echo "Starting local databases (Redis, MySQL)..."
echo "Note: MongoDB expected to be available at 172.16.30.46"

# Start databases using docker compose (excluding MongoDB)
docker compose -f docker-compose-local.yml up -d redis mysql

echo "Waiting for databases to be ready..."
sleep 8

# Check if Redis is ready
echo "Checking Redis connection..."
if docker compose -f docker-compose-local.yml exec redis redis-cli ping >/dev/null 2>&1; then
    echo "✓ Redis is ready"
else
    echo "✗ Redis is not responding"
    exit 1
fi

# Check if MySQL is ready
echo "Checking MySQL connection..."
if docker compose -f docker-compose-local.yml exec mysql mysqladmin ping -u media --password=changeme -h localhost >/dev/null 2>&1; then
    echo "✓ MySQL is ready"
else
    echo "✗ MySQL is not responding"
    exit 1
fi

echo "Local databases are running and ready!"
echo "Redis: localhost:6379"
echo "MySQL: localhost:3306"
echo "MongoDB: 172.16.30.46:27017 (external)"
echo ""
echo "To stop the databases, run: docker compose -f docker-compose-local.yml down"