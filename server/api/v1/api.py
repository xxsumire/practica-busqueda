from fastapi import APIRouter
from api.v1 import find_path

api_router = APIRouter()

api_router.include_router(find_path.router, prefix="/find-path", tags=["algorithm A*", "aestrella", "A*"])