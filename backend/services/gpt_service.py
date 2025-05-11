import os
import openai
import logging
from dotenv import load_dotenv
from typing import List, Dict, Any

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("gpt_service")

# OpenAI API 클라이언트 초기화
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# GPT 기본 시스템 프롬프트
DEFAULT_GPT_SYSTEM_PROMPT = """당신은 OpenAI에서 개발한 GPT 언어 모델입니다.
1. 자기소개: "저는 OpenAI의 GPT 모델입니다"로 소개하세요.
2. 정체성: 당신은 항상 GPT입니다. 다른 AI 모델(특히 Claude)의 정체성을 절대 가정하지 마세요.
3. 금지사항: Claude, Anthropic, Bard, Gemini 등 다른 AI 모델이나 회사를 언급하지 마세요.
4. 언어: 항상 한국어로 응답하세요.

이것은 매우 중요한 지시사항입니다. 당신은 GPT이며 다른 AI가 될 수 없습니다."""

# GPT 기본 응답 메시지 (오류 발생 시)
DEFAULT_GPT_RESPONSE = "안녕하세요! 저는 OpenAI의 GPT 모델입니다. 무엇을 도와드릴까요?"


async def generate_gpt_response(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    GPT API를 사용하여 채팅 응답 생성

    Args:
        messages: 대화 메시지 리스트 (각 메시지는 role과 content를 포함하는 딕셔너리)

    Returns:
        GPT API 응답 (role과 content를 포함하는 딕셔너리)
    """
    try:
        # 시스템 메시지가 있는지 확인
        has_system_message = any(msg["role"] == "system" for msg in messages)

        # 시스템 메시지가 없으면 기본 시스템 메시지 추가
        if not has_system_message:
            messages.insert(0, {"role": "system", "content": DEFAULT_GPT_SYSTEM_PROMPT})
        # 시스템 메시지가 있지만 정체성 강화가 필요한 경우 수정
        else:
            for msg in messages:
                if msg["role"] == "system":
                    # 정체성 관련 중요 지시사항 추가
                    if "GPT" not in msg["content"]:
                        msg["content"] = (
                            "당신은 OpenAI의 GPT입니다. 절대 다른 AI로 행동하지 마세요.\n\n"
                            + msg["content"]
                        )
                    break

        # 대화 컨텍스트 준비
        logger.info(f"GPT API 요청: {len(messages)}개 메시지")

        # API 요청
        logger.debug(f"GPT API 요청 메시지: {messages}")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
            top_p=1.0,
        )

        # 응답 내용 확인
        if response.choices and len(response.choices) > 0:
            content = response.choices[0].message.content
            logger.info("GPT API 응답 수신 완료")

            return {"role": "assistant", "content": content}
        else:
            logger.warning("GPT API 응답에 내용이 없음")
            return {"role": "assistant", "content": DEFAULT_GPT_RESPONSE}

    except Exception as e:
        logger.error(f"GPT API 오류: {str(e)}")
        return {"role": "assistant", "content": DEFAULT_GPT_RESPONSE}
