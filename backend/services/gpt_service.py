import os
import openai
import logging
import re
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

응답 형식 및 스타일 가이드라인:
1. 모든 응답은 시각적으로 매력적이고 구조화된 형식으로 제공하세요.
2. 제목과 부제목을 효과적으로 활용하세요:
   - 큰 섹션은 "# 제목" 또는 "## 부제목" 형식으로 구분
   - 작은 섹션은 "### 소제목" 형식으로 구분
3. 글머리 기호와 번호 매기기를 적극 활용하여 정보를 구조화하세요.
4. 중요한 정보나 핵심 개념은 **굵은 글씨**로 강조하세요.
5. 복잡하거나 긴 내용은 섹션별로 나누어 가독성을 높이세요.
6. 내용이 단조롭게 나열되지 않도록 다양한 Markdown 요소를 사용하세요.
7. 표, 구분선, 인용 등 다양한 서식 요소를 적절히 활용하세요.
8. 사용자가 간단한 질문을 했더라도, 답변은 항상 시각적으로 세련되고 구조화된 형태로 제공하세요.
9. 정보의 흐름이 논리적이고 시각적으로 명확하게 구분되도록 응답을 디자인하세요.

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
   - 올바른 예: $\sin(x)$, $\cos(x)$, $\log(x)$
   - 잘못된 예: $sin(x)$, $cos(x)$, $log(x)$
10. 변수 선언과 같은 수식에서 등호(=)는 분리하지 말고 하나의 수식으로 처리하세요:
    - 올바른 예: $u = x^2$
    - 잘못된 예: $u$ = $x^2$

중요: 수식을 요청받자마자 첫 응답에서 바로 KaTeX 형식($...$, $$...$$)을 사용하세요.
사용자가 명시적으로 수식을 요청하지 않아도, 수학적 개념을 설명할 때는 항상 KaTeX 형식을 사용하세요.

이것은 매우 중요한 지시사항입니다. 당신은 GPT이며 다른 AI가 될 수 없습니다."""

# GPT 기본 응답 메시지 (오류 발생 시)
DEFAULT_GPT_RESPONSE = "안녕하세요! 저는 OpenAI의 GPT 모델입니다. 무엇을 도와드릴까요?"

# 수학 관련 키워드 목록 (수식 처리를 활성화하기 위한 키워드)
MATH_KEYWORDS = [
    "수식",
    "방정식",
    "함수",
    "미분",
    "적분",
    "행렬",
    "벡터",
    "삼각",
    "지수",
    "로그",
    "극한",
    "급수",
    "확률",
    "통계",
    "대수",
    "기하",
    "집합",
    "논리",
    "증명",
    "계산",
    "그래프",
    "분수",
    "제곱",
    "근호",
    "공식",
    "법칙",
    "정리",
    "피타고라스",
    "유도",
    "수학",
    "물리",
    "공학",
    "계산",
    "공식",
    "변수",
    "상수",
    "정의",
    "값",
    "도함수",
    "기울기",
    "접선",
    "속도",
    "가속도",
    "힘",
    "운동",
    "에너지",
]


def detect_math_content(message: str) -> bool:
    """
    사용자 메시지에 수학 관련 내용이 있는지 감지
    """
    # 정규식으로 수학 기호 패턴 감지
    math_patterns = [
        r"\b[a-zA-Z]+\s*=\s*[a-zA-Z0-9\+\-\*\/\^\(\)]+",  # 방정식 패턴: x = y+2
        r"[a-zA-Z\d\s]*[\+\-\*\/\=\^\(\)\[\]\{\}\<\>]+[a-zA-Z\d\s]*",  # 수학 기호 포함
        r"\b\d+\s*[\+\-\*\/\^]\s*\d+",  # 간단한 계산: 2 + 2
        r"\bf\s*\([a-zA-Z0-9]+\)",  # 함수 표기: f(x)
        r"\bdx\b|\bdy\b|\bsin\b|\bcos\b|\btan\b|\blog\b|\bln\b",  # 수학 용어
        r"\bx\^2\b|\bx\^n\b|\bn\^2\b",  # 지수 표현
        r"\b[a-zA-Z]_[a-zA-Z0-9]\b",  # 아래첨자 표현: a_n
    ]

    # 정규식 패턴 매칭
    for pattern in math_patterns:
        if re.search(pattern, message):
            return True

    # 키워드 매칭
    for keyword in MATH_KEYWORDS:
        if keyword in message:
            return True

    return False


def enhance_math_instructions(messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    수학 관련 질문이 감지되면 수식 표현 지시사항 강화
    """
    # 사용자의 마지막 메시지 확인
    if not messages or len(messages) < 1:
        return messages

    user_messages = [msg for msg in messages if msg["role"] == "user"]
    if not user_messages:
        return messages

    last_user_message = user_messages[-1]["content"]

    # 수학 관련 내용이 감지되면 시스템 메시지 강화
    if detect_math_content(last_user_message):
        # 기존 시스템 메시지가 있는지 확인
        system_message_index = next(
            (i for i, msg in enumerate(messages) if msg["role"] == "system"), None
        )

        math_instruction = """
        중요: 이 질문에는 수학적 개념이 포함되어 있습니다.
        모든 수식은 반드시 LaTeX 문법으로 $...$ 또는 $$...$$ 형식을 사용하여 표현하세요.
        일반 텍스트 형식(x^2)이나 대괄호([y = mx + b])로 수식을 작성하지 마세요.

        수식 작성 시 특별한 주의사항:
        1. 연속된 수학 표현식을 여러 개의 $...$ 쌍으로 불필요하게 나누지 마세요.
           - 잘못된 예: $u$ $=$ $x^2$, $dv$ $=$ $\sin(x)dx$
           - 올바른 예: $u = x^2$, $dv = \sin(x)dx$
        2. 모든 수학 함수는 반드시 백슬래시(\)를 사용하세요:
           - 올바른 예: $\sin(x)$, $\cos(x)$, $\log(x)$
           - 잘못된 예: $sin(x)$, $cos(x)$, $log(x)$
        3. 변수 선언과 같은 수식에서 등호(=)는 분리하지 말고 하나의 수식으로 처리하세요:
           - 올바른 예: $u = x^2$
           - 잘못된 예: $u$ = $x^2$
        """

        if system_message_index is not None:
            # 기존 시스템 메시지 강화
            messages[system_message_index]["content"] += "\n" + math_instruction
        else:
            # 시스템 메시지가 없으면 추가
            messages.insert(
                0,
                {
                    "role": "system",
                    "content": DEFAULT_GPT_SYSTEM_PROMPT + "\n" + math_instruction,
                },
            )

    return messages


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

        # 수학 관련 질문이면 지시사항 강화
        messages = enhance_math_instructions(messages)

        # 대화 컨텍스트 준비
        logger.info(f"GPT API 요청: {len(messages)}개 메시지")

        # API 요청
        logger.debug(f"GPT API 요청 메시지: {messages}")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.3,
            max_tokens=1000,
            top_p=1.0,
            presence_penalty=0.1,
            frequency_penalty=0.1,
        )

        # 응답 내용 확인
        if response.choices and len(response.choices) > 0:
            content = response.choices[0].message.content
            logger.info("GPT API 응답 수신 완료")

            # 수식 형식 교정 후처리
            content = correct_math_formatting(content)

            return {"role": "assistant", "content": content}
        else:
            logger.warning("GPT API 응답에 내용이 없음")
            return {"role": "assistant", "content": DEFAULT_GPT_RESPONSE}

    except Exception as e:
        logger.error(f"GPT API 오류: {str(e)}")
        return {"role": "assistant", "content": DEFAULT_GPT_RESPONSE}


def correct_math_formatting(content: str) -> str:
    """
    응답에서 수식이 올바른 형식으로 작성되었는지 확인하고 교정
    """
    # 코드 블록 임시 제거 (수식 변환에서 제외)
    code_blocks = []

    def replace_code_block(match):
        code_blocks.append(match.group(0))
        return f"CODE_BLOCK_{len(code_blocks)-1}_PLACEHOLDER"

    content_without_code = re.sub(
        r"```[\s\S]*?```|`[^`\n]+`", replace_code_block, content
    )

    # 대괄호로 둘러싸인 수식을 KaTeX 형식으로 변환
    bracket_pattern = r"\[([^\[\]\n]+?)\]"
    content_without_code = re.sub(bracket_pattern, r"$\1$", content_without_code)

    # 알려진 수식 패턴 변환
    patterns_to_fix = [
        # 지수 형식: x^2, x^n 등
        (r"(?<![`$])\b([a-zA-Z0-9])[\s]*\^[\s]*([a-zA-Z0-9])(?![$`])", r"$\1^\2$"),
        # 아래첨자 형식: x_1, a_n 등
        (r"(?<![`$])\b([a-zA-Z0-9])[\s]*_[\s]*([a-zA-Z0-9])(?![$`])", r"$\1_\2$"),
        # 분수 형식: a/b, x/y 등
        (
            r"(?<![`$\w])((?:\d+|\b[a-zA-Z]\b)[\s]*/[\s]*(?:\d+|\b[a-zA-Z]\b))(?![$`])",
            r"$\1$",
        ),
        # 기본 수학 함수: sin(x), cos(x) 등 (백슬래시 추가)
        (
            r"(?<![`$\\])\b(sin|cos|tan|log|ln)[\s]*\(([a-zA-Z0-9]+)\)(?![$`])",
            r"$\\mathbf{\1}(\2)$",
        ),
        # 개선된 방정식 패턴: y = mx + b 등 (등호 포함 표현식)
        (
            r"(?<![`$])\b([a-zA-Z])[\s]*=[\s]*([a-zA-Z0-9\s\+\-\*/\^\(\)]+?)(?![$`])([\s\n.,;:]|$)",
            r"$\1 = \2$\3",
        ),
        # 적분 표현식: int f(x) dx
        (
            r"(?<![`$\\])\b(int)[\s]+([a-zA-Z0-9\s\+\-\*/\^\(\)]+?)[\s]*d([a-zA-Z])(?![$`])",
            r"$\\int \2 d\3$",
        ),
        # 연속된 수학 표현식 패턴 수정 (예: u = x^2, dv = sin(x)dx)
        (
            r"\$([a-zA-Z0-9]+)\$[\s]*=[\s]*\$([a-zA-Z0-9\s\+\-\*/\^\(\)]+)\$",
            r"$\1 = \2$",
        ),
        # 함수 이름에 백슬래시 추가 (sin -> \sin)
        (
            r"\$(sin|cos|tan|log|ln)(?!\\)([^\$]+)\$",
            r"$\\\1\2$",
        ),
    ]

    # 패턴 수정
    for pattern, replacement in patterns_to_fix:
        content_without_code = re.sub(pattern, replacement, content_without_code)

    # 코드 블록 복원
    def restore_code_block(match):
        index = int(match.group(1))
        return code_blocks[index] if index < len(code_blocks) else match.group(0)

    content = re.sub(
        r"CODE_BLOCK_(\d+)_PLACEHOLDER", restore_code_block, content_without_code
    )

    # 마지막으로 분리된 수식 표현식 병합 (예: $u$ = $x^2$ -> $u = x^2$)
    content = re.sub(r"\$([^\$]+)\$\s*=\s*\$([^\$]+)\$", r"$\1 = \2$", content)

    return content
