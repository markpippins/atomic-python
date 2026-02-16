#!/usr/bin/env python3
"""
Debug script to test the problematic endpoints and catch the actual errors
"""

import sys
import os
import traceback
sys.path.insert(0, '/home/codex/dev/atomic/python/fs-crawler/app')

# Set environment for logging
os.environ['LOG_LEVEL'] = 'DEBUG'

from fastapi.testclient import TestClient
from app.main import app
from contextlib import asynccontextmanager
import asyncio
from app.database import init_databases, close_databases
from app.api.routes import router
from fastapi import FastAPI


async def manual_test():
    """Manually test the problematic functions"""
    print("Initializing databases...")
    await init_databases()
    print("Databases initialized successfully")
    
    # Import the problematic functions
    from app.api.routes import list_libraries, create_default_rules, search_files
    from app.services.rules_engine import RulesEngine
    
    print("\nTesting list_libraries...")
    try:
        result = await list_libraries()
        print(f"Success: {len(result)} libraries found")
    except Exception as e:
        print(f"Error in list_libraries: {e}")
        traceback.print_exc()
    
    print("\nTesting create_default_rules...")
    try:
        engine = RulesEngine()
        result = await engine.create_default_rules()
        print(f"Success: Created {len(result)} default rules")
    except Exception as e:
        print(f"Error in create_default_rules: {e}")
        traceback.print_exc()
    
    print("\nTesting search_files...")
    try:
        result = await search_files(q="test", limit=5)
        print(f"Success: Search returned {len(result['results']) if 'results' in result else 'unknown'} results")
    except Exception as e:
        print(f"Error in search_files: {e}")
        traceback.print_exc()
    
    print("\nClosing databases...")
    await close_databases()


def main():
    asyncio.run(manual_test())


if __name__ == "__main__":
    main()