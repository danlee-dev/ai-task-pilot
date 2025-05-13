import os
import anthropic
import logging
from dotenv import load_dotenv
from typing import List, Dict, Any

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("claude_service")

# Claude API 클라이언트 초기화
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Claude 기본 시스템 프롬프트
DEFAULT_CLAUDE_SYSTEM_PROMPT = """당신은 Anthropic에서 개발한 Claude AI 어시스턴트입니다.
1. 자기소개: "저는 Anthropic의 Claude AI입니다"로 자신을 소개하세요.
2. 정체성: 당신은 항상 Claude입니다. 다른 AI 모델을 흉내내거나 참조하지 마세요.
3. 언어: 항상 한국어로 응답하세요.

응답 형식 및 스타일 가이드라인:
1. 응답은 항상 시각적으로 구조화하고 읽기 쉽게 작성하세요.
2. 제목과 소제목을 적극적으로 사용하세요:
   - 주요 섹션은 큰 제목(# 또는 ##)으로 시작
   - 하위 섹션은 더 작은 제목(### 또는 ####)으로 구분
3. 내용이 긴 경우 항상 번호 매기기나 글머리 기호를 사용하여 정보를 구조화하세요.
4. 중요한 개념이나 핵심 용어는 **굵은 글씨**로 강조하세요.
5. 전체 응답에서 일관된 시각적 스타일을 유지하세요.
6. 단순 나열식 응답보다 시각적으로 구분된 섹션으로 정보를 구성하세요.
7. 복잡한 개념을 설명할 때는 제목, 설명, 예시를 포함한 구조적 형식을 사용하세요.
8. 단조로운 텍스트 블록은 피하고, 다양한 Markdown 요소를 활용하여 가독성을 높이세요.
9. 사용자가 특별히 간단한 응답을 요청하지 않는 한, 항상 세련되고 시각적으로 구조화된 응답을 제공하세요.

수학 공식이나 수식 관련 지시사항 (매우 중요):
1. 모든 수학 공식과 수식은 반드시 KaTeX 문법으로 작성하세요.
2. 인라인 수식: 반드시 $...$ 형식을 사용하세요. (예: $E = mc^2$)
3. 블록 수식: 반드시 $$...$$ 형식을 사용하세요. (예: $$\int_{a}^{b} f(x) dx$$)
4. 수식을 처음부터 작성할 때는 무조건 LaTeX 문법을 사용하세요:
   - 분수: $\frac{분자}{분모}$
   - 지수: $x^n$
   - 아래첨자: $x_n$
   - 그리스 문자: $\alpha$, $\beta$, $\gamma$, $\pi$
   - 적분: $\int_{하한}^{상한} 식 dx$
   - 극한: $\lim_{x \to 0} f(x)$
   - 시그마: $\sum_{i=1}^{n} i$
5. 어떤 질문이든 수식이 포함되어야 할 경우 항상 LaTeX 문법을 사용하세요.
6. 수식을 일반 텍스트(x^2)나 대괄호([y = mx + b])로 작성하지 마세요.
7. 사용자가 수학, 물리학, 공학 또는 관련 분야의 질문을 하면 반드시 KaTeX 표기법을 사용하세요.
8. 연속된 수학 표현식을 여러 개의 $...$ 쌍으로 불필요하게 나누지 마세요.
   - 잘못된 예: $u$ $=$ $x^2$, $dv$ $=$ $\sin(x)dx$
   - 올바른 예: $u = x^2$, $dv = \sin(x)dx$
9. 모든 수학 함수는 반드시 백슬래시(\)를 사용하세요:
   - 올바른 예: $\sin(x)$, $\cos(x)$, $\log(x)$, $\int f(x) dx$
   - 잘못된 예: $sin(x)$, $cos(x)$, $log(x)$, $int f(x) dx$
10. 변수 선언과 같은 수식에서 등호(=)는 분리하지 말고 하나의 수식으로 처리하세요:
    - 올바른 예: $u = x^2$, $dv = \sin(x)dx$
    - 잘못된 예: $u$ = $x^2$, $dv$ = $\sin(x)dx$

이 지시사항을 반드시 따르세요."""

# Claude 기본 응답 메시지 (오류 발생 시)
DEFAULT_CLAUDE_RESPONSE = (
    "안녕하세요! 저는 Anthropic의 Claude AI입니다. 어떻게 도와드릴까요?"
)


async def generate_claude_response(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Claude API를 사용하여 채팅 응답 생성

    Args:
        messages: 대화 메시지 리스트 (각 메시지는 role과 content를 포함하는 딕셔너리)

    Returns:
        Claude API 응답 (role과 content를 포함하는 딕셔너리)
    """
    try:
        # GPT 메시지 형식을 Claude 형식으로 변환
        claude_messages = []
        system_content = DEFAULT_CLAUDE_SYSTEM_PROMPT

        # 메시지 분리 - 시스템 메시지와 사용자/어시스턴트 메시지
        for msg in messages:
            if msg["role"] == "system":
                # 시스템 메시지 내용 저장
                system_content = msg["content"]

                # 정체성 관련 지시사항 추가 (필요한 경우)
                if "Claude" not in system_content and "Anthropic" not in system_content:
                    system_content = (
                        "당신은 Anthropic의 Claude AI입니다. 절대 GPT가 아닙니다.\n\n"
                        + system_content
                    )
            elif msg["role"] == "user" or msg["role"] == "assistant":
                # 사용자 및 어시스턴트 메시지 추가
                claude_messages.append(msg)

        # 대화 컨텍스트가 없는 경우 기본 메시지 추가
        if not claude_messages:
            claude_messages.append(
                {"role": "user", "content": "안녕하세요, 자기소개를 해주세요."}
            )

        # Claude API 호출 준비
        logger.info(f"Claude API 요청: {len(claude_messages)}개 메시지")
        logger.debug(f"Claude API 요청 메시지: {claude_messages}")

        # Claude API 호출
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1000,
            system=system_content,  # 시스템 메시지를 별도 파라미터로 전달
            messages=claude_messages,
            temperature=0.7,
        )

        # 응답 내용 처리
        if (
            hasattr(response, "content")
            and response.content
            and len(response.content) > 0
        ):
            try:
                # 객체 확인 및 텍스트 추출
                content_text = response.content[0].text
                logger.info("Claude API 응답 수신 완료")
                return {"role": "assistant", "content": content_text}
            except Exception as e:
                logger.error(f"Claude 응답 파싱 오류: {str(e)}")
                return {
                    "role": "assistant",
                    "content": "죄송합니다. 응답을 처리하는 중 오류가 발생했습니다.",
                }
        else:
            # 응답 내용이 없는 경우
            logger.warning("Claude API 응답에 내용이 없음")
            return {"role": "assistant", "content": DEFAULT_CLAUDE_RESPONSE}

    except Exception as e:
        # 에러 처리
        logger.error(f"Claude API 오류: {str(e)}")
        return {
            "role": "assistant",
            "content": DEFAULT_CLAUDE_RESPONSE,
        }


def convert_to_claude_format(messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    GPT 메시지 형식을 Claude API가 이해할 수 있는 형식으로 변환

    Args:
        messages: GPT 형식의 메시지 리스트

    Returns:
        Claude 형식의 메시지 리스트
    """
    claude_messages = []

    # 사용자와 어시스턴트 메시지만 추가 (시스템 메시지는 별도로 처리)
    for message in messages:
        role = message["role"]

        # 시스템 메시지는 건너뛰기 (별도 파라미터로 전달)
        if role == "system":
            continue

        # 사용자와 어시스턴트 메시지만 추가
        if role == "user" or role == "assistant":
            claude_messages.append({"role": role, "content": message["content"]})

    # 메시지가 없는 경우 기본 메시지 추가
    if not claude_messages:
        claude_messages.append(
            {"role": "user", "content": "안녕하세요, 자기소개를 해주세요."}
        )

    return claude_messages
