#!/usr/bin/env python3
"""
Script to start the fs-crawler backend application
"""

import sys
import os
sys.path.insert(0, '/home/codex/dev/atomic/python/fs-crawler/app')

# Set environment variable for logging
os.environ['LOG_LEVEL'] = 'DEBUG'

# Import and run the application
from app.main import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")