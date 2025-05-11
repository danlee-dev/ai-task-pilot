// 3. src/components/chat/MessageBubble.tsx
// TypingEffect와 MarkdownRenderer를 사용하는 메시지 버블 컴포넌트
import TypingEffect from "@/components/TypingEffect";
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import styles from "./MessageBubble.module.css"; // 스타일 분리

interface Message {
  role: string;
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  typingEnabled?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  typingEnabled = true,
}) => {
  const isAI = message.role === "assistant";

  // AI 응답이고 타이핑 이펙트가 활성화된 경우 타이핑 이펙트 적용
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

  // 사용자 메시지이거나 타이핑 이펙트가 비활성화된 경우 공통 마크다운 렌더러 사용
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
