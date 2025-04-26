from typing import Generator
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from query_data import repondre_question
from pydantic import BaseModel
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str  

async def simulate_stream(response: str) -> Generator[str, None, None]: # type: ignore
    """Helper to simulate streaming from non-streaming function"""
    for word in response.split(" "):
        yield f"{word} "
        await asyncio.sleep(0.05)

@app.post("/api/chat-stream")
async def chat_stream(request: ChatRequest):
    try:
        full_response = repondre_question(request.question)
        
        return StreamingResponse(
            simulate_stream(full_response),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))