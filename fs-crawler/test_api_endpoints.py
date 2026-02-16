#!/usr/bin/env python3
"""
Test script to verify all API endpoints work correctly with the new configuration
"""

import asyncio
import httpx
import json
from typing import Dict, List, Any


async def test_endpoint(client: httpx.AsyncClient, method: str, url: str, data: Dict[str, Any] = None, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """Test a single endpoint and return the response"""
    try:
        if method.upper() == "GET":
            response = await client.get(url, params=params)
        elif method.upper() == "POST":
            if params:
                # For POST with query parameters
                response = await client.post(url, params=params)
            else:
                # For POST with JSON data
                response = await client.post(url, json=data)
        elif method.upper() == "PUT":
            response = await client.put(url, json=data)
        elif method.upper() == "DELETE":
            response = await client.delete(url)
        
        return {
            "url": url,
            "method": method,
            "status_code": response.status_code,
            "success": response.status_code < 400,
            "response": response.text[:200] + "..." if len(response.text) > 200 else response.text
        }
    except Exception as e:
        return {
            "url": url,
            "method": method,
            "status_code": "ERROR",
            "success": False,
            "response": str(e)
        }


async def test_all_endpoints():
    """Test all API endpoints"""
    base_url = "http://localhost:8000"
    
    endpoints = [
        # System endpoints
        ("GET", f"{base_url}/"),
        ("GET", f"{base_url}/health"),
        ("GET", f"{base_url}/system/status"),
        
        # Library management
        ("GET", f"{base_url}/api/v1/libraries"),
        ("POST", f"{base_url}/api/v1/libraries", None, {"path": "/tmp/test", "name": "Test Lib", "scan_enabled": "true"}),
        ("GET", f"{base_url}/api/v1/libraries"),  # Check if new library was added
        
        # Scanning
        ("POST", f"{base_url}/api/v1/scan/start", None, {"path": "/tmp/test"}),
        ("GET", f"{base_url}/api/v1/scan/status"),
        ("POST", f"{base_url}/api/v1/scan/stop"),
        
        # Search and files
        ("GET", f"{base_url}/api/v1/search", None, {"limit": "5"}),
        ("GET", f"{base_url}/api/v1/stats"),
        
        # Duplicates
        ("GET", f"{base_url}/api/v1/duplicates/stats"),
        ("POST", f"{base_url}/api/v1/duplicates/detect", None, {"auto_mark": "false"}),
        ("GET", f"{base_url}/api/v1/duplicates/candidates", None, {"limit": "5"}),
        ("GET", f"{base_url}/api/v1/duplicates/groups", None, {"limit": "5"}),
        
        # Rules engine
        ("GET", f"{base_url}/api/v1/rules"),
        ("GET", f"{base_url}/api/v1/rules/templates"),
        ("POST", f"{base_url}/api/v1/rules/defaults"),
        
        # Configuration
        ("GET", f"{base_url}/api/v1/config/file-types"),
        ("GET", f"{base_url}/api/v1/config/handlers"),
    ]
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        results = []
        
        for i, endpoint in enumerate(endpoints):
            method = endpoint[0]
            url = endpoint[1]
            data = endpoint[2] if len(endpoint) > 2 else None
            params = endpoint[3] if len(endpoint) > 3 else None
            
            print(f"Testing {method} {url} ({i+1}/{len(endpoints)})...")
            
            result = await test_endpoint(client, method, url, data, params)
            results.append(result)
            
            if result["success"]:
                print(f"  ✓ Success (Status: {result['status_code']})")
            else:
                print(f"  ✗ Failed (Status: {result['status_code']})")
                
        return results


def summarize_results(results: List[Dict[str, Any]]):
    """Summarize test results"""
    total_tests = len(results)
    successful_tests = sum(1 for r in results if r["success"])
    failed_tests = total_tests - successful_tests
    
    print(f"\n=== TEST SUMMARY ===")
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {failed_tests}")
    
    if failed_tests > 0:
        print(f"\n=== FAILED TESTS ===")
        for result in results:
            if not result["success"]:
                print(f"  {result['method']} {result['url']} - Status: {result['status_code']}")
                print(f"    Response: {result['response'][:100]}")
    

if __name__ == "__main__":
    print("Testing all API endpoints...")
    results = asyncio.run(test_all_endpoints())
    summarize_results(results)