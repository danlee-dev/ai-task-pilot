// 8. src/hooks/useChatState.ts
// Custom hook for managing chat state and logic
import { useState, useEffect } from "react";
import { sendChat } from "@/utils/api";
import { Message } from "@/types/chat";

// UI 상태를 나타내는 열거형
export enum ChatUIState {
  Initial = "initial", // 초기 상태 (입력창이 중앙에 있음)
  Animating = "animating", // 애니메이션 중
  Active = "active", // 채팅 활성화 상태 (입력창이 하단에 있음)
}

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uiState, setUIState] = useState<ChatUIState>(ChatUIState.Initial);
  const [heroOpacity, setHeroOpacity] = useState<number>(1);
  const [typingEffectEnabled] = useState<boolean>(true);

  // 상태 전환 시 타이밍 조정
  useEffect(() => {
    // Animating 상태가 되면 일정 시간 후 Active 상태로 전환
    if (uiState === ChatUIState.Animating) {
      const timer = setTimeout(() => {
        setUIState(ChatUIState.Active);
      }, 800); // 애니메이션 지속 시간과 일치시킴

      return () => clearTimeout(timer);
    }
  }, [uiState]);

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
    const fullMessages = [systemPrompt, ...updatedMessages];

    // 화면에 표시할 메시지 업데이트
    setMessages(updatedMessages);
    setIsLoading(true);

    // 첫 메시지인 경우 UI 상태 전환 및 애니메이션 시작
    if (uiState === ChatUIState.Initial) {
      setHeroOpacity(0); // 로고 페이드 아웃

      // 약간의 지연 후 애니메이션 시작 (페이드아웃 효과가 먼저 시작되도록)
      setTimeout(() => {
        setUIState(ChatUIState.Animating); // 애니메이션 시작
      }, 50);
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
      // 추후 구현: TaskInput에 프롬프트 전달
    }
  };

  // 애니메이션 상태 확인 헬퍼
  const isAnimating = uiState === ChatUIState.Animating;
  const hasResponse = uiState === ChatUIState.Active;

  return {
    messages,
    isLoading,
    isAnimating,
    hasResponse,
    heroOpacity,
    typingEffectEnabled,
    handleSubmit,
    handleActionClick,
    uiState,
  };
};
