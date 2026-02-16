#!/usr/bin/env python3
"""
Debug script to identify where the application hangs during startup
"""
import asyncio
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
import structlog

print("1. Starting debug script...")

# Configure logging
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
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()
print("2. Logger configured")

# Import with timing
print("3. About to import modules...")
start_time = time.time()

try:
    from app.config import settings
    print(f"4. Config imported in {time.time() - start_time:.2f}s")
    
    from app.database import init_databases, close_databases
    print(f"5. Database module imported in {time.time() - start_time:.2f}s")
    
    from app.api.routes import router
    print(f"6. Routes imported in {time.time() - start_time:.2f}s")
    
    from app.services.startup import StartupService
    print(f"7. Startup service imported in {time.time() - start_time:.2f}s")
    
except Exception as e:
    print(f"ERROR importing modules: {e}")
    import traceback
    traceback.print_exc()

print(f"8. All imports completed in {time.time() - start_time:.2f}s")

# Create app without lifespan to test if that's the issue
print("9. Creating app without lifespan...")
app = FastAPI(
    title="Media Metadata Service Debug",
    description="Debug version",
    version="2.0.0"
)

app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"status": "debug"}

print("10. App created successfully")

# Now test the lifespan function separately
async def test_lifespan():
    print("11. Testing lifespan function...")
    start_time = time.time()
    
    try:
        # Initialize database connections
        print("12. Initializing databases...")
        await init_databases()
        print(f"13. Database connections initialized in {time.time() - start_time:.2f}s")

        # Initialize system and resume operations
        print("14. Initializing startup service...")
        startup_service = StartupService()
        print("15. Startup service created, initializing system...")
        await startup_service.initialize_system()
        print(f"16. System initialized in {time.time() - start_time:.2f}s")

        print("Lifespan test completed successfully!")
        
    except Exception as e:
        print(f"ERROR in lifespan: {e}")
        import traceback
        traceback.print_exc()

# Run the lifespan test
async def main():
    await test_lifespan()

if __name__ == "__main__":
    print("Running lifespan test...")
    asyncio.run(main())
    print("Debug script completed")