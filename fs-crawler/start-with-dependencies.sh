#!/bin/bash

# Wait for services with limited retries
echo "Waiting for services to be ready..."

# Wait for Redis (with max 10 attempts)
attempt=1
max_attempts=10
while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Checking Redis connection..."
    if ./wait-for-it.sh redis:6379 -t 5; then
        echo "✓ Redis is ready!"
        break
    else
        echo "✗ Redis not ready, waiting..."
        if [ $attempt -eq $max_attempts ]; then
            echo "⚠️  Warning: Could not connect to Redis after $max_attempts attempts. Proceeding anyway..."
        fi
        sleep 5
    fi
    ((attempt++))
done

# Wait for MongoDB (with max 10 attempts)
attempt=1
while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Checking MongoDB connection..."
    # Try to connect to MongoDB with the correct credentials
    if ./wait-for-it.sh mongodb:27017 -t 5 && python -c "
import sys
try:
    from pymongo import MongoClient
    client = MongoClient('mongodb://mongoUser:somePassword@mongodb:27017/?authSource=admin')
    client.admin.command('ping')
    print('MongoDB connection successful')
    sys.exit(0)
except Exception as e:
    print(f'MongoDB connection failed: {e}')
    sys.exit(1)
"; then
        echo "✓ MongoDB is ready!"
        break
    else
        echo "✗ MongoDB not ready, waiting..."
        if [ $attempt -eq $max_attempts ]; then
            echo "⚠️  Warning: Could not connect to MongoDB after $max_attempts attempts. Proceeding anyway..."
        fi
        sleep 5
    fi
    ((attempt++))
done

# Wait for MySQL (with max 10 attempts)
attempt=1
while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts: Checking MySQL connection..."
    if ./wait-for-it.sh mysql:3306 -t 5; then
        echo "✓ MySQL is ready!"
        break
    else
        echo "✗ MySQL not ready, waiting..."
        if [ $attempt -eq $max_attempts ]; then
            echo "⚠️  Warning: Could not connect to MySQL after $max_attempts attempts. Proceeding anyway..."
        fi
        sleep 5
    fi
    ((attempt++))
done

echo "Starting the application..."

# Start the application
exec python -m uvicorn main:app --host 0.0.0.0 --port 8004 --reload