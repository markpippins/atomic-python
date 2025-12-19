import logging
from fastapi import FastAPI, HTTPException
from app.models import ServiceRequest, ServiceResponse
from app.broker import Broker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Broker Service Python")
broker = Broker()

# --- Sample Handler ---
async def test_handler(params: dict):
    logger.info(f"Test handler called with params: {params}")
    return {"message": "Hello from Python Broker!", "received_params": params}

# Register the sample handler
broker.register("testBroker", "test", test_handler)

# --- Endpoints ---

@app.post("/api/broker/submitRequest", response_model=ServiceResponse)
async def submit_request(request: ServiceRequest):
    response = await broker.submit(request)
    if not response.ok:
        # In the Java controller, it returns 400 Bad Request for errors.
        # We can do the same, or just return the response with 200 OK but ok=False.
        # The Java code: return ResponseEntity.badRequest().body(response);
        # So we should probably set the status code to 400 if not ok.
        from fastapi.responses import JSONResponse
        from fastapi.encoders import jsonable_encoder
        
        return JSONResponse(
            status_code=400,
            content=jsonable_encoder(response)
        )
    return response

@app.post("/api/broker/testBroker", response_model=ServiceResponse)
async def test_broker():
    # Mimic the Java testBroker endpoint
    request = ServiceRequest(
        service="testBroker",
        operation="test",
        params={},
        requestId="test-request"
    )
    return await submit_request(request)

@app.get("/health")
def health_check():
    return {"status": "UP"}
