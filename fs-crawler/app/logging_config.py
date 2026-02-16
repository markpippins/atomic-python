"""
Comprehensive logging configuration for the fs-crawler application
"""

import sys
import logging
import structlog
from pathlib import Path
from datetime import datetime


def setup_logging(log_level: str = "INFO", log_file: str = None, log_format: str = "json"):
    """
    Set up comprehensive logging for the application
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional file path to write logs to
        log_format: Format of logs ('json' or 'console')
    """
    
    # Configure the underlying logging system
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)  # Always log to stdout for containerization
        ]
    )
    
    # Add file handler if specified
    if log_file:
        # Create log directory if it doesn't exist
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(getattr(logging, log_level.upper()))
        logging.getLogger().addHandler(file_handler)
    
    # Configure structlog
    if log_format == "json":
        # JSON format for production and easy tailing
        processors = [
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ]
    else:
        # Console format for development
        processors = [
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.dev.ConsoleRenderer()
        ]
    
    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Log the logging setup
    logger = structlog.get_logger()
    logger.info(
        "Logging system initialized",
        log_level=log_level,
        log_format=log_format,
        log_file=log_file,
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