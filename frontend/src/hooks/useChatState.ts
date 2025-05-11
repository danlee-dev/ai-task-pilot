// 8. src/hooks/useChatState.ts
// This hook is now deprecated - use useChat from ChatContext instead
import { useChat } from "@/contexts/ChatContext";

export { ChatUIState } from "@/contexts/ChatContext";

// 호환성을 위해 useChatState를 useChat으로 리다이렉트
export const useChatState = () => {
  return useChat();
};
