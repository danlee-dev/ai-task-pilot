// 8. src/hooks/useChatState.ts
// 채팅 관련 상태 및 로직을 관리하는 커스텀 훅
import { useState } from "react";
import { sendChat } from "@/utils/api";

interface Message {
  role: string;
  content: string;
}

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [heroOpacity, setHeroOpacity] = useState<number>(1);
  const [typingEffectEnabled] = useState<boolean>(true);

  // 채팅 입력 처리
  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    const systemPrompt: Message = {
      role: "system",
      content:
        "You are a helpful AI assistant who remembers the conversation and responds like a collaborative teammate.",
    };

    // 새 사용자 메시지 추가
    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    // API 요청을 위한 전체 메시지
    const fullMessages = [systemPrompt, ...updatedMessages];

    // 화면에 표시할 메시지 업데이트
    setMessages(updatedMessages);
    setIsLoading(true);

    // UI 애니메이션 처리
    if (!hasResponse) {
      // 타이틀 영역 페이드 아웃
      setHeroOpacity(0);

      // 애니메이션 시작
      setTimeout(() => {
        setIsAnimating(true);

        // 애니메이션 완료 후 상태 전환
        setTimeout(() => {
          setHasResponse(true);

          // 애니메이션 상태 해제
          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
        }, 700);
      }, 200);
    }

    try {
      // AI 응답 요청
      const res = await sendChat(fullMessages);
      const assistantMessage: Message = {
        role: "assistant",
        content: res.content,
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 액션 버튼 클릭 처리
  const handleActionClick = (action: string) => {
    const actionPrompts: Record<string, string> = {
      "Solve with Auto Analysis":
        "Analyze this problem and provide a step-by-step solution:",
      "Talk with AI Partner": "I'd like to discuss a project idea with you:",
      Research: "Research this topic and provide a detailed overview:",
      Sora: "Generate a visual description of:",
      More: "I need more options for:",
    };

    if (actionPrompts[action]) {
      console.log(`Selected action: ${action}`);
      // 여기에 TaskInput 컴포넌트에 프롬프트를 전달하는 로직 추가
    }
  };

  // 현재 상태에 따른 클래스 결정
  const getContentClassName = (baseClass: string): string => {
    if (isAnimating) {
      return `${baseClass} ${baseClass}--animating`;
    } else if (hasResponse) {
      return `${baseClass} ${baseClass}--chatActive`;
    }
    return `${baseClass} ${baseClass}--centered`;
  };

  return {
    messages,
    isLoading,
    hasResponse,
    isAnimating,
    heroOpacity,
    typingEffectEnabled,
    handleSubmit,
    handleActionClick,
    getContentClassName,
  };
};
