from pydantic import BaseModel
from typing import Literal


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class GenerateRequest(BaseModel):
    messages: list[Message]


class GenerateResponse(BaseModel):
    code: str


class ErrorResponse(BaseModel):
    detail: str
