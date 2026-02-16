#!/usr/bin/env python3
"""
Simple test script to verify logging functionality
"""

import asyncio
import os
import sys
from pathlib import Path

# Add the app directory to the path so we can import modules
sys.path.insert(0, str(Path(__file__).parent / "app"))

from logging_config import setup_logging, get_logger
from docker_logging import setup_docker_logging


def test_basic_logging():
    """Test basic logging functionality"""
    print("Testing basic logging setup...")

    # Test regular logging with file output
    setup_logging(log_level="INFO", log_file="logs/app.log", log_format="json")
    logger = get_logger(__name__)

    logger.info("Basic logging test", test_type="basic")
    logger.debug("Debug message", test_type="debug")
    logger.warning("Warning message", test_type="warning")
    logger.error("Error message", test_type="error")

    print("✓ Basic logging test completed\n")


def test_docker_logging():
    """Test Docker-specific logging"""
    print("Testing Docker logging setup...")
    
    # Test Docker logging
    setup_docker_logging(log_level="INFO")
    logger = get_logger(__name__)
    
    logger.info("Docker logging test", test_type="docker")
    logger.debug("Docker debug message", test_type="docker_debug")
    logger.warning("Docker warning message", test_type="docker_warning")
    
    print("✓ Docker logging test completed\n")


def test_structured_logging():
    """Test structured logging with extra fields"""
    print("Testing structured logging with extra fields...")
    
    setup_logging(log_level="INFO", log_format="json")
    logger = get_logger(__name__)
    
    # Test with various structured data
    logger.info(
        "Structured log test",
        user_id=12345,
        action="login",
        ip_address="192.168.1.1",
        metadata={"role": "admin", "permissions": ["read", "write"]}
    )
    
    logger.error(
        "Error with context",
        operation="file_scan",
        file_path="/tmp/test.mp3",
        error_code=404,
        retry_count=3
    )
    
    print("✓ Structured logging test completed\n")


async def test_async_logging():
    """Test logging in async context"""
    print("Testing async logging...")
    
    setup_logging(log_level="INFO", log_format="json")
    logger = get_logger(__name__)
    
    async def async_operation(op_id: int):
        logger.info("Starting async operation", operation_id=op_id)
        await asyncio.sleep(0.1)  # Simulate async work
        logger.info("Completed async operation", operation_id=op_id)
        return f"result_{op_id}"
    
    # Run multiple async operations
    tasks = [async_operation(i) for i in range(3)]
    results = await asyncio.gather(*tasks)
    
    logger.info("All async operations completed", results=results)
    print("✓ Async logging test completed\n")


def test_error_logging():
    """Test error logging with exceptions"""
    print("Testing error logging with exceptions...")
    
    setup_logging(log_level="INFO", log_format="json")
    logger = get_logger(__name__)
    
    try:
        # Simulate an error
        result = 10 / 0
    except ZeroDivisionError as e:
        logger.error(
            "Division by zero error occurred",
            error=str(e),
            error_type=type(e).__name__,
            numerator=10,
            denominator=0
        )
    
    print("✓ Error logging test completed\n")


if __name__ == "__main__":
    print("Running logging tests...\n")
    
    test_basic_logging()
    test_docker_logging()
    test_structured_logging()
    test_error_logging()
    
    # Run async test
    asyncio.run(test_async_logging())
    
    print("All logging tests completed successfully!")
    print("\nTo tail the logs, run:")
    print("  python scripts/tail_logs.py logs/app.log -f --format pretty")