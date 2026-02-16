# Local Development Setup

This guide explains how to run the fs-crawler application with local database instances (Redis, MySQL) and external MongoDB.

## Prerequisites

- Docker and Docker Compose installed
- Python 3.8+
- Virtual environment with dependencies installed
- Access to MongoDB at 172.16.30.32:27017 with credentials admin/changeme

## Setup

1. **Create and activate virtual environment:**
   ```bash
   cd /path/to/python/fs-crawler
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

## Running the Application

### Option 1: Run local databases, then the application with external MongoDB

1. **Start local databases (Redis and MySQL):**
   ```bash
   ./scripts/start_all_databases_local.sh
   ```

2. **In another terminal, run the application with external MongoDB:**
   ```bash
   ./scripts/run_app_external_mongo.sh
   ```

## Scripts Overview

- `start_all_databases_local.sh` - Starts Redis and MySQL using Docker Compose
- `run_app_external_mongo.sh` - Runs the application connecting to external MongoDB at 172.16.30.32

## Accessing the Application

Once running, the application will be available at:
- API: http://localhost:8000
- Health check: http://localhost:8000/health

## Tailing Logs

To tail the application logs:
```bash
python scripts/tail_logs.py logs/app.log -f --format pretty
```

## Stopping Services

To stop the local databases:
```bash
cd /path/to/python/fs-crawler
docker compose -f docker-compose-local.yml down
```