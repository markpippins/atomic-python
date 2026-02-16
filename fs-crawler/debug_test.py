#!/usr/bin/env python3
"""
Debug script to test the problematic endpoints
"""

import sys
import os
sys.path.insert(0, '/home/codex/dev/atomic/python/fs-crawler/app')

# Set environment for logging
os.environ['LOG_LEVEL'] = 'DEBUG'

from fastapi.testclient import TestClient
from app.main import app

async def test_endpoints():
    # Initialize the app with lifespan
    async with app.router.lifespan_context(app) as lifespan:
        client = TestClient(app, raise_server_exceptions=False)

        print("Testing health endpoint...")
        response = client.get("/")
        print(f"Health: {response.status_code} - {response.json()}")

        print("\nTesting libraries endpoint...")
        response = client.get("/api/v1/libraries")
        print(f"Libraries: {response.status_code} - {response.text[:200]}")

        print("\nTesting search endpoint...")
        try:
            response = client.get("/api/v1/search?limit=5")
            print(f"Search: {response.status_code} - {response.text[:200]}")
        except Exception as e:
            print(f"Search error: {e}")

        print("\nTesting rules defaults endpoint...")
        try:
            response = client.post("/api/v1/rules/defaults")
            print(f"Rules defaults: {response.status_code} - {response.text[:200]}")
        except Exception as e:
            print(f"Rules defaults error: {e}")

def main():
    import asyncio
    asyncio.run(test_endpoints())

if __name__ == "__main__":
    main()