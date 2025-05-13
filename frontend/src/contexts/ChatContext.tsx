"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { sendChat, switchAIAndContinue } from "@/utils/api";

// 메시지 타입 정의
export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "ai-task";
  content: string;
  timestamp: Date;
  ai_model?: string; // 어떤 AI 모델이 생성했는지 표시
}

// UI 상태를 나타내는 열거형
export enum ChatUIState {
  Initial = "initial", // 초기 상태 (입력창이 중앙에 있음)
  Animating = "animating", // 애니메이션 중
  Active = "active", // 채팅 활성화 상태 (입력창이 하단에 있음)
}

// ChatContext에서 제공하는 값들의 타입 정의
interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  isAnimating: boolean;
  hasResponse: boolean;
  heroOpacity: number;
  uiState: ChatUIState;
  typingEffectEnabled: boolean;
  currentAiModel: string;
  handleSubmit: (text: string) => Promise<void>;
  handleActionClick: (action: string) => void;
  switchAiModel: (model: string) => void;
}

// Context 생성
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// 채팅 컨텍스트 프로바이더 컴포넌트
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uiState, setUIState] = useState<ChatUIState>(ChatUIState.Initial);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [typingEffectEnabled] = useState(true);
  const [currentAiModel, setCurrentAiModel] = useState<string>("gpt");

  // 애니메이션 상태 계산
  const isAnimating = uiState === ChatUIState.Animating;

  // 응답이 있는지 여부 계산
  const hasResponse =
    messages.length > 0 || isAnimating || uiState === ChatUIState.Active;

  // 애니메이션 완료 후 Active 상태로 전환
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setUIState(ChatUIState.Active);
      }, 800); // 애니메이션 시간과 일치시킵니다
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // AI 모델 전환 함수 - useCallback으로 메모이제이션
  const switchAiModel = useCallback(
    async (model: string) => {
      if (model === currentAiModel) {
        return; // 이미 같은 모델이면 변경 없음
      }

      // 대화가 없는 경우 단순히 모델만 변경
      if (messages.length === 0) {
        setCurrentAiModel(model);
        return;
      }

      // 대화가 있는 경우 AI 모델 전환 과정 시작
      setIsLoading(true);

      try {
        // API 요청 준비 - 모든 사용자/어시스턴트 메시지 포함
        const apiMessages = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // AI 전환 API 호출
        const response = await switchAIAndContinue(apiMessages, currentAiModel); // api 통신 이기 때문에 async, await 사용해야함

        // 전환 알림 메시지 추가
        const switchMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: response.message.content,
          timestamp: new Date(),
          ai_model: response.ai_model,
        };

        // 메시지 목록에 전환 메시지 추가
        setMessages((prev) => [...prev, switchMessage]);

        // 현재 AI 모델 업데이트
        setCurrentAiModel(response.ai_model);
      } catch (error) {
        console.error("AI 전환 오류:", error);

        // 오류 메시지 추가
        const errorMessage: Message = {
          id: uuidv4(),
          role: "system",
          content: "An error occurred while switching AI models.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentAiModel, messages, setCurrentAiModel, setIsLoading, setMessages]
  ); // 의존성 배열에 있는 요소들이 바뀔때만 함수를 새로 만들어줘라는 것, 이 외엔 기존 함수 그대로 써주라는 것

  // 키보드 단축키 이벤트 리스너 추가
  useEffect(() => {
    // useEffect는 렌더링 된 코드에서 이팩트를 주는 것
    const handleKeyDown = (e: KeyboardEvent) => {
      // Option(Alt) + Tab 단축키로 AI 모델 전환
      if (e.altKey && e.key === "Tab") {
        e.preventDefault(); // 기본 Tab 동작 방지
        // 현재 모델 전환 (gpt -> claude, claude -> gpt)
        const nextModel = currentAiModel === "gpt" ? "claude" : "gpt";
        switchAiModel(nextModel);
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown); // 'keydown'은 키보드 이벤트 리스너 이름

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentAiModel, switchAiModel]); // currentAiModel과 switchAiModel이 변경될 때마다 이벤트 리스너 업데이트

  // 채팅 입력 처리
  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    // 첫 메시지인 경우 UI 상태 전환 및 애니메이션 시작
    if (uiState === ChatUIState.Initial) {
      setHeroOpacity(0); // 로고 페이드 아웃

      // 약간의 지연 후 애니메이션 시작
      setTimeout(() => {
        setUIState(ChatUIState.Animating); // 애니메이션 시작
      }, 50);
    }

    // 사용자 메시지 생성
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    // 채팅에 메시지 추가
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API 요청 준비 - 사용자 및 어시스턴트 메시지만 포함
      const apiMessages = messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant") // role이 system이나, ai-task 등등의 메세지는 받으면 안됨
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // 현재 사용자 메시지 추가
      apiMessages.push({ role: "user", content: text }); // push 메서드는 배열에 요소 추가(== append in python) 배열에 요소 추가하고 배열의 길이를 반환

      // API 호출
      const response = await sendChat(apiMessages, currentAiModel);

      // 응답 메시지 생성
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.message.content,
        timestamp: new Date(),
        ai_model: response.ai_model,
      };

      // 사용 중인 AI 모델 업데이트
      setCurrentAiModel(response.ai_model);

      // 채팅에 응답 추가
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);

      // 에러 메시지 추가
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, an error occurred. Please try again.",
        timestamp: new Date(),
        ai_model: currentAiModel,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 액션 버튼 클릭 처리
  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action}`);
    // 여기에 액션 처리 로직 추가 (예: 새 대화 시작, 설정 등)
  };

  // Context 값 제공
  const value: ChatContextType = {
    messages,
    isLoading,
    isAnimating,
    hasResponse,
    heroOpacity,
    uiState,
    typingEffectEnabled,
    currentAiModel,
    handleSubmit,
    handleActionClick,
    switchAiModel,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
