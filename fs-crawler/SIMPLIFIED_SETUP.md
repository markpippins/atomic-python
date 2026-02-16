# FS-Crawler Setup Guide

## Prerequisites

- Python 3.11+
- Docker and Docker Compose
- MySQL 8.0
- Redis 7+
- MongoDB 6+

## Quick Start

### 1. Setup Virtual Environment
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Local Databases
```bash
# Start Redis and MySQL locally
docker compose -f docker-compose-local.yml up -d
```

### 3. Start the Application
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

## Frontend Setup

### Start Development Server
```bash
cd ui
npm run dev
```

The UI will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:8000`.

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