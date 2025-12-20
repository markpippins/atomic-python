from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class ServiceRequest(BaseModel):
    service: str
    operation: str
    params: Dict[str, Any] = Field(default_factory=dict)
    requestId: str
    encrypt: bool = False

class ServiceResponse(BaseModel):
    ok: bool
    data: Optional[Any] = None
    errors: Optional[List[Dict[str, Any]]] = None
    requestId: str
    ts: datetime = Field(default_factory=datetime.now)
    version: str = "1.0"
    service: Optional[str] = None
    operation: Optional[str] = None
    encrypt: bool = False

    @classmethod
    def success(cls, data: Any, request_id: str, service: str = None, operation: str = None) -> "ServiceResponse":
        return cls(
            ok=True,
            data=data,
            requestId=request_id,
            service=service,
            operation=operation,
            ts=datetime.now()
        )

    @classmethod
    def error(cls, errors: List[Dict[str, Any]], request_id: str, service: str = None, operation: str = None) -> "ServiceResponse":
        return cls(
            ok=False,
            errors=errors,
            requestId=request_id,
            service=service,
            operation=operation,
            ts=datetime.now()
        )
