// 4. src/components/chat/ChatBox.tsx
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import styles from "./ChatBox.module.css"; // 스타일 분리
import { Message } from "@/types/chat";

interface ChatBoxProps {
  messages: Message[];
  isLoading: boolean;
  typingEffectEnabled: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  isLoading,
  typingEffectEnabled,
}) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (chatBoxRef.current) {
      // Small delay to ensure rendering is complete
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isLoading]);

  return (
    <div className={styles.chatBox} ref={chatBoxRef}>
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg}
          typingEnabled={
            typingEffectEnabled &&
            msg.role === "assistant" &&
            index === messages.length - 1 &&
            !isLoading
          }
        />
      ))}
      {isLoading && (
        <div className={styles.botBubble}>
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div className={styles.scrollSpacer}></div>
    </div>
  );
};

export default ChatBox;
