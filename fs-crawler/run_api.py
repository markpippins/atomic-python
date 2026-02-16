#!/usr/bin/env python3
"""
Wrapper script to run the API server with correct Python path
This script should be run from within the virtual environment
"""
import sys
import os

# Add the project root directory to the Python path
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8004,
        reload=False,
        log_config=None
    )
