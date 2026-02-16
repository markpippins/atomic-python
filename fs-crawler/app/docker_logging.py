"""
Docker logging configuration for the fs-crawler application
"""

import os
import sys
import logging
import structlog
from pathlib import Path
from datetime import datetime


def setup_docker_logging(log_level: str = "INFO"):
    """
    Set up logging optimized for Docker containers
    - Logs to stdout/stderr for container logging systems
    - Uses JSON format for easy parsing
    - No file logging (handled by Docker)
    """
    
    # Configure the underlying logging system to use stdout
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)  # Log to stdout for Docker
        ]
    )
    
    # Configure structlog with JSON format for containerized environments
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Log the logging setup
    logger = structlog.get_logger()
    logger.info(
        "Docker logging system initialized",
        log_level=log_level,
        timestamp=datetime.utcnow().isoformat()
    )


def get_logger(name=None):
    """
    Get a configured logger instance
    
    Args:
        name: Optional logger name (defaults to caller's module name)
    """
    return structlog.get_logger(name)


# Default logger instance
logger = get_logger(__name__)