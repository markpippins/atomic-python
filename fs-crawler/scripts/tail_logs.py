#!/usr/bin/env python3
"""
Log tailing utility for the fs-crawler application
Provides real-time log monitoring and filtering capabilities
"""

import os
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime
import time
from typing import Optional, Dict, Any


def format_log_entry(log_line: str, format_type: str = "pretty") -> str:
    """
    Format a log entry based on the specified format
    
    Args:
        log_line: Raw log line (JSON string)
        format_type: Output format ('pretty', 'json', 'simple')
    """
    try:
        log_data = json.loads(log_line)
    except json.JSONDecodeError:
        # If not JSON, return as-is
        return log_line
    
    if format_type == "json":
        return json.dumps(log_data, indent=2)
    
    elif format_type == "simple":
        timestamp = log_data.get('timestamp', log_data.get('time', 'N/A'))
        level = log_data.get('level', 'N/A')
        event = log_data.get('event', 'N/A')
        return f"[{timestamp}] {level}: {event}"
    
    else:  # pretty format
        timestamp = log_data.get('timestamp', log_data.get('time', 'N/A'))
        level = log_data.get('level', 'N/A')
        logger = log_data.get('logger', log_data.get('logger_name', 'N/A'))
        event = log_data.get('event', log_data.get('msg', 'N/A'))
        
        # Format additional fields
        extra_fields = []
        for key, value in log_data.items():
            if key not in ['timestamp', 'time', 'level', 'logger', 'logger_name', 'event', 'msg', 'exc_info']:
                extra_fields.append(f"{key}={value}")
        
        extra_str = " | " + " ".join(extra_fields) if extra_fields else ""
        
        return f"[{timestamp}] [{level}] [{logger}] {event}{extra_str}"


def tail_log_file(
    log_file: str,
    lines: int = 10,
    follow: bool = True,
    format_type: str = "pretty",
    level_filter: Optional[str] = None,
    logger_filter: Optional[str] = None,
    search_filter: Optional[str] = None
) -> None:
    """
    Tail a log file with various filtering and formatting options
    
    Args:
        log_file: Path to the log file
        lines: Number of lines to show initially
        follow: Whether to follow the file for new entries
        format_type: Output format ('pretty', 'json', 'simple')
        level_filter: Filter by log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        logger_filter: Filter by logger name
        search_filter: Filter by search term in log message
    """
    log_path = Path(log_file)
    
    if not log_path.exists():
        print(f"Error: Log file {log_file} does not exist")
        return
    
    # Read initial lines
    with open(log_path, 'r') as f:
        all_lines = f.readlines()
    
    # Show last 'lines' entries
    initial_lines = all_lines[-lines:] if len(all_lines) >= lines else all_lines
    
    for line in initial_lines:
        line = line.strip()
        if not line:
            continue
            
        try:
            log_data = json.loads(line)
            
            # Apply filters
            if level_filter and log_data.get('level', '').upper() != level_filter.upper():
                continue
            if logger_filter and logger_filter.lower() not in log_data.get('logger', '').lower():
                continue
            if search_filter and search_filter.lower() not in json.dumps(log_data).lower():
                continue
                
            print(format_log_entry(line, format_type))
            
        except json.JSONDecodeError:
            # If not JSON, print as-is
            print(line)
    
    if not follow:
        return
    
    # Follow mode - watch for new entries
    with open(log_path, 'r') as f:
        # Move to end of file
        f.seek(0, 2)
        
        while True:
            line = f.readline()
            if line:
                line = line.strip()
                if not line:
                    continue
                    
                try:
                    log_data = json.loads(line)
                    
                    # Apply filters
                    if level_filter and log_data.get('level', '').upper() != level_filter.upper():
                        continue
                    if logger_filter and logger_filter.lower() not in log_data.get('logger', '').lower():
                        continue
                    if search_filter and search_filter.lower() not in json.dumps(log_data).lower():
                        continue
                        
                    print(format_log_entry(line, format_type))
                    
                except json.JSONDecodeError:
                    # If not JSON, print as-is
                    print(line)
            else:
                time.sleep(0.1)  # Small delay to prevent busy waiting


def main():
    parser = argparse.ArgumentParser(
        description="Tail and filter logs from the fs-crawler application",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s logs/app.log                    # Tail log file with last 10 lines
  %(prog)s logs/app.log -f                 # Follow log file in real-time
  %(prog)s logs/app.log -n 20 -f           # Show 20 lines and follow
  %(prog)s logs/app.log --level ERROR      # Show only ERROR level logs
  %(prog)s logs/app.log --logger scanner   # Show only scanner-related logs
  %(prog)s logs/app.log --search "scan"    # Show logs containing 'scan'
  %(prog)s logs/app.log --format json      # Output in JSON format
        """
    )
    
    parser.add_argument(
        'log_file',
        help='Path to the log file to tail'
    )
    
    parser.add_argument(
        '-n', '--lines',
        type=int,
        default=10,
        help='Number of lines to show initially (default: 10)'
    )
    
    parser.add_argument(
        '-f', '--follow',
        action='store_true',
        help='Follow the log file for new entries'
    )
    
    parser.add_argument(
        '--level',
        dest='level_filter',
        choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        help='Filter logs by level'
    )
    
    parser.add_argument(
        '--logger',
        dest='logger_filter',
        help='Filter logs by logger name (partial match)'
    )
    
    parser.add_argument(
        '--search',
        dest='search_filter',
        help='Filter logs by search term (case-insensitive)'
    )
    
    parser.add_argument(
        '--format',
        dest='format_type',
        choices=['pretty', 'json', 'simple'],
        default='pretty',
        help='Output format (default: pretty)'
    )
    
    args = parser.parse_args()
    
    try:
        tail_log_file(
            log_file=args.log_file,
            lines=args.lines,
            follow=args.follow,
            format_type=args.format_type,
            level_filter=args.level_filter,
            logger_filter=args.logger_filter,
            search_filter=args.search_filter
        )
    except KeyboardInterrupt:
        print("\nStopping log tail...")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()