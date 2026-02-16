# FS-Crawler Setup Guide

This guide provides comprehensive instructions for setting up and deploying the FS-Crawler application with all required dependencies.

## Prerequisites

- Python 3.11+
- Docker and Docker Compose
- MySQL 8.0
- Redis 7+
- MongoDB 6+

## Quick Start

### 1. Clone and Navigate to Project
```bash
cd /path/to/atomic/python/fs-crawler
```

### 2. Setup Virtual Environment
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Start Local Databases
```bash
# Start Redis and MySQL locally
docker compose -f docker-compose-local.yml up -d
```

### 4. Configure Environment Variables
Create a `.env.local` file with the following content:
```bash
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://mongoUser:somePassword@172.16.30.32:27017
MYSQL_URL=mysql://media:changeme@localhost:3306/media
MONGODB_DATABASE=media_metadata
LOG_LEVEL=INFO
```

### 5. Start the Application
```bash
# Run the application with external MongoDB
./scripts/run_app_external_mongo.sh
```

The application will be available at `http://localhost:8000`

## Architecture Overview

### Database Connections
- **Redis**: Used for state persistence and caching (localhost:6379)
- **MySQL**: Used for configuration and library management (localhost:3306)
- **MongoDB**: Used for flexible metadata document storage (172.16.30.32:27017)

### Key Features
- Resumable scanning with Redis-based state persistence
- Multi-format support (audio, video, images, documents)
- Duplicate detection with quality assessment
- Smart deletion rules with configurable preferences
- REST API for all operations

## API Endpoints

### Health Checks
- `GET /health` - Health check
- `GET /system/status` - Detailed system status

### Library Management
- `GET /api/v1/libraries` - List library paths
- `POST /api/v1/libraries` - Add library path

### Scanning
- `POST /api/v1/scan/start` - Start scan
- `GET /api/v1/scan/status` - Scan status
- `POST /api/v1/scan/stop` - Stop scan

### Search
- `GET /api/v1/search` - Search files
- `GET /api/v1/files/{id}` - Get file metadata

### Duplicate Detection
- `GET /api/v1/duplicates/stats` - Duplicate statistics
- `POST /api/v1/duplicates/detect` - Start duplicate detection
- `GET /api/v1/duplicates/groups` - Get duplicate groups
- `GET /api/v1/duplicates/candidates` - Get deletion candidates

### Rules Engine
- `GET /api/v1/rules` - List deletion rules
- `POST /api/v1/rules` - Create custom rule
- `POST /api/v1/rules/templates` - Create rule from template

## Frontend Setup

### 1. Navigate to UI Directory
```bash
cd ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The UI will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:8000`.

## Configuration

### Database Schema Notes
- MySQL uses lowercase enum values ('album', 'compilation', 'recent', 'general') for PathType
- FileCategory enum values in database are lowercase ('audio', 'video', 'image', 'document', 'other')

### Logging
- Structured JSON logging using structlog
- Logs are written to `logs/app.log`
- Use the log tailing utility: `scripts/tail_logs.py`

## Troubleshooting

### Common Issues
1. **Database Connection Errors**: Verify Redis, MySQL, and MongoDB are running and accessible
2. **Enum Value Mismatch**: Ensure enum values in code match database enum values
3. **Serialization Errors**: Check that SQLAlchemy objects are properly converted to Pydantic models

### Useful Scripts
- `scripts/run_app_external_mongo.sh` - Start app with external MongoDB
- `scripts/start_databases_local.sh` - Start local Redis and MySQL
- `scripts/tail_logs.py` - Tail and filter application logs
- `scripts/init.sql` - Database initialization script

## Production Deployment

### 1. Update Configuration
- Secure all passwords and connection strings
- Configure volume mounts for media directories
- Set up proper logging aggregation

### 2. Deploy Services
```bash
# For production deployment
docker-compose up -d --build
```

### 3. Monitor Services
- Check service logs regularly
- Monitor resource usage
- Set up alerts for critical errors

## Development Mode

For development with hot reloading:
```bash
# Start backend with auto-reload
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start frontend separately
cd ui && npm run dev
```

## Backup and Recovery

### Database Backups
- Regular backups of Redis, MySQL, and MongoDB data
- Export library configurations periodically
- Maintain copies of important metadata

### Recovery Process
1. Restore database dumps
2. Restart services in order: Redis → MySQL → MongoDB → Application
3. Verify system status and resume operations

## Performance Tuning

### Configuration Options
- `MAX_CONCURRENT_SCANS`: Maximum parallel scan operations
- `SCAN_BATCH_SIZE`: Files processed per batch
- `MAX_FILE_SIZE_MB`: Maximum file size to process

Adjust these values based on your hardware resources and requirements.