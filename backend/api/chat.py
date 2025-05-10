from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import openai
import os
from dotenv import load_dotenv

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message] # 이게 gpt가 메모리를 가진거처럼 이전 기록을 기억하는 로직 -> 프론트에서 list 자료형을 백엔드로 전달해야함(여기서 나중에 RAG 기술이 쓰여야함)


class ChatResponse(BaseModel):
    message: Dict[str, Any]


@router.post("/chat", response_model=ChatResponse)
async def chat_completion(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": msg.role, "content": msg.content} for msg in request.messages # FastAPI의 객체를 OpenAI입력을 위해 JSON형태로 변환
            ],
            temperature=0.7,
            max_tokens=1000,
        )

        return {"message": response.choices[0].message.model_dump()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
