from fastapi import APIRouter, HTTPException
from app.schemas import GenerateRequest, GenerateResponse
from app.claude_service import claude_service

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest) -> GenerateResponse:
    """
    Accepts a conversation history and returns Claude-generated React JSX code.
    """
    if not request.messages:
        raise HTTPException(status_code=400, detail="Messages list cannot be empty.")

    try:
        code = claude_service.generate_code(request.messages)
        return GenerateResponse(code=code)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
