from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from services import generate_gpt_response, generate_claude_response
import time

load_dotenv()

router = APIRouter()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    ai_model: Optional[str] = "gpt"  # 기본 AI 모델은 GPT


class ChatResponse(BaseModel):
    message: Dict[str, Any]
    ai_model: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    채팅 API: 대화 메시지를 처리하고 AI 응답을 생성합니다.
    """
    try:
        # 메시지 포맷 변환
        formatted_messages = [
            {"role": msg.role, "content": msg.content} for msg in request.messages
        ]

        # AI 모델 결정
        ai_model = request.ai_model.lower()
        if ai_model not in ["gpt", "claude"]:
            ai_model = "gpt"  # 기본값

        # 시스템 메시지 확인
        has_system_message = any(msg["role"] == "system" for msg in formatted_messages)

        # AI 모델별 시스템 메시지 추가
        if not has_system_message:
            if ai_model == "claude":
                formatted_messages.insert(
                    0,
                    {
                        "role": "system",
                        "content": """당신은 Anthropic에서 개발한 Claude AI 어시스턴트입니다.
1. 자기소개: "저는 Anthropic의 Claude AI입니다"로 자신을 소개하세요.
2. 정체성: 당신은 항상 Claude입니다. 다른 AI 모델을 흉내내거나 참조하지 마세요.
3. 언어: 항상 한국어로 응답하세요.
4. 이전 대화: 이전 대화 내용을 참고하여 자연스럽게 대화를 이어가세요.

이 지시사항을 반드시 따르세요.""",
                    },
                )
            else:
                formatted_messages.insert(
                    0,
                    {
                        "role": "system",
                        "content": """당신은 OpenAI에서 개발한 GPT 언어 모델입니다.
1. 자기소개: "저는 OpenAI의 GPT 모델입니다"로 소개하세요.
2. 정체성: 당신은 항상 GPT입니다. 다른 AI 모델(특히 Claude)의 정체성을 절대 가정하지 마세요.
3. 금지사항: Claude, Anthropic, Bard, Gemini 등 다른 AI 모델이나 회사를 언급하지 마세요.
4. 언어: 항상 한국어로 응답하세요.
5. 이전 대화: 이전 대화 내용을 참고하여 자연스럽게 대화를 이어가세요.

이것은 매우 중요한 지시사항입니다. 당신은 GPT이며 절대로 Claude AI가 아닙니다.""",
                    },
                )

        # AI 모델별 응답 생성
        if ai_model == "claude":
            response = await generate_claude_response(formatted_messages)
        else:
            response = await generate_gpt_response(formatted_messages)

        # 응답에 AI 모델 정보 추가
        response["ai_model"] = ai_model

        return {"message": response, "ai_model": ai_model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat API 오류: {str(e)}")


@router.post("/chat/switch", response_model=ChatResponse)
async def switch_ai_and_continue(request: ChatRequest):
    """
    AI 모델 전환 API: 현재 사용 중인 AI 모델에서 다른 모델로 전환하고 대화 컨텍스트를 준비합니다.
    """
    try:
        # 메시지 포맷 변환
        formatted_messages = [
            {"role": msg.role, "content": msg.content} for msg in request.messages
        ]

        # 현재 모델이 gpt면 claude로, claude면 gpt로 전환
        target_model = "gpt" if request.ai_model.lower() == "claude" else "claude"

        # 대화 내용 보존 - 시스템 메시지만 필터링
        preserved_messages = [
            msg for msg in formatted_messages if msg["role"] != "system"
        ]

        # 모델 전환 성공을 알리는 시스템 메시지 생성
        switch_message = {
            "role": "assistant",
            "content": f"AI model switched to {target_model.upper()}. Please continue with your message.",
            "ai_model": target_model,
        }

        return {"message": switch_message, "ai_model": target_model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 전환 오류: {str(e)}")
