// 4. src/components/chat/ChatBox.tsx
import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import styles from "./ChatBox.module.css"; // 스타일 분리

interface Message {
  role: string;
  content: string;
}

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
    // 새 메시지가 추가될 때 스크롤을 항상 맨 아래로 이동
    if (chatBoxRef.current) {
      // 약간의 지연 후 스크롤 - 렌더링 완료 보장
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
