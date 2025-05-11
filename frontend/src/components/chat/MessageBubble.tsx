// src/components/chat/MessageBubble.tsx
// Message bubble component using TypingEffect and MarkdownRenderer
import TypingEffect from "@/components/TypingEffect";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import styles from "./MessageBubble.module.css";
import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  typingEnabled?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  typingEnabled = true,
}) => {
  const isAI = message.role === "assistant";

  // Apply typing effect for AI responses when enabled
  if (isAI && typingEnabled) {
    return (
      <div className={styles.botBubble}>
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
      className={message.role === "user" ? styles.userBubble : styles.botBubble}
    >
      <div className={styles.messageContent}>
        <MarkdownRenderer content={message.content} />
      </div>
    </div>
  );
};

export default MessageBubble;
