from typing import List, Optional
from pydantic import BaseModel, Field

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., description="Message text content")

class ChatRequest(BaseModel):
    message: str = Field(..., description="User's farming question")
    history: List[ChatMessage] = Field(default_factory=list, description="Recent conversation turns")
    crop_context: Optional[str] = Field(None, description="Current crop context (e.g. from diagnosis)")
    language: str = Field(default="en", description="Preferred response language: en or ur")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI farming assistant response")
    suggested_followups: List[str] = Field(default_factory=list, description="Relevant contextual follow-up questions")
    language: str = Field(default="en")
