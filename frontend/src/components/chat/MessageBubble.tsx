// src/components/chat/MessageBubble.tsx
// Message bubble component using TypingEffect and MarkdownRenderer
import TypingEffect from "./TypingEffect";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import styles from "./MessageBubble.module.css";
import { Message } from "@/contexts/ChatContext"; // 경로 업데이트

interface MessageBubbleProps {
  message: Message;
  typingEnabled?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  typingEnabled = true,
}) => {
  const isAI = message.role === "assistant";
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  // 시스템 메시지 스타일 적용
  if (isSystem) {
    return (
      <div className={styles.systemBubble}>
        <div className={styles.messageContent}>
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  // Apply typing effect for AI responses when enabled
  if (isAI && typingEnabled) {
    return (
      <div className={styles.botBubble}>
        {message.ai_model && (
          <div className={`${styles.aiModelBadge} ${styles[message.ai_model]}`}>
            {message.ai_model.toUpperCase()}
          </div>
        )}
        <TypingEffect
          content={message.content}
          typingSpeed={5}
          initialDelay={300}
        />
      </div>
    );
  }

  // Use standard markdown renderer for user messages or when typing effect is disabled
  return (
    <div
      className={isUser ? styles.userBubble : styles.botBubble}
    >
      {isAI && message.ai_model && (
        <div className={`${styles.aiModelBadge} ${styles[message.ai_model]}`}>
          {message.ai_model.toUpperCase()}
        </div>
      )}
      <div className={styles.messageContent}>
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
};

export default MessageBubble;
