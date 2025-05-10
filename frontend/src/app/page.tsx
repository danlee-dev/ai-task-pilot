"use client";
import Link from "next/link";
import { useState, useRef, useEffect, ComponentProps } from "react";
import styles from "./page.module.css";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import TaskInput from "@/components/TaskInput";
import { sendChat } from "@/utils/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import TypingEffect from "@/components/TypingEffect";

// Separate component for message bubbles for better code organization
// MessageBubble 컴포넌트 업데이트 - 타이핑 이펙트 적용

// 기존 MessageBubble 컴포넌트를 수정하여 타이핑 이펙트 적용
const MessageBubble = ({
  message,
  typingEnabled = true, // 타이핑 이펙트 적용 여부 (AI 응답에만 적용)
}: {
  message: { role: string; content: string };
  typingEnabled?: boolean;
}) => {
  const isAI = message.role === "assistant";

  // AI 응답이고 타이핑 이펙트가 활성화된 경우 타이핑 이펙트 적용
  if (isAI && typingEnabled) {
    return (
      <div className={styles.botBubble}>
        <TypingEffect
          content={message.content}
          typingSpeed={5} // 타이핑 속도 조정 (값이 작을수록 빠름)
          initialDelay={300} // 시작 전 지연 시간 (ms)
        />
      </div>
    );
  }

  // 사용자 메시지이거나 타이핑 이펙트가 비활성화된 경우 기존 렌더링 사용
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 코드 블록 렌더링을 위한 컴포넌트
  const CodeBlock = ({
    inline,
    className,
    children,
    ...props
  }: ComponentProps<"code"> & { children: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeText = String(children).replace(/\n$/, "");

    // 인라인 코드가 아니고 언어가 지정된 코드 블록일 경우
    if (!inline && match) {
      return (
        <div className={styles.codeShell}>
          <div className={styles.codeHeader}>
            <span className={styles.languageLabel}>{language}</span>
            <button
              className={styles.copyButton}
              onClick={() => copyToClipboard(codeText)}
              aria-label="코드 복사"
            >
              복사
            </button>
          </div>
          <div className={styles.codeContent}>
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              {...props}
            >
              {codeText}
            </SyntaxHighlighter>
          </div>
        </div>
      );
    }

    // 인라인 코드일 경우
    return (
      <code className={`${className} ${styles.inlineCode}`} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div
      className={message.role === "user" ? styles.userBubble : styles.botBubble}
    >
      <div className={styles.messageContent}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            // 제목 태그 스타일링 추가
            h1: ({ node, ...props }) => (
              <h1 className={styles.headingOne} {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className={styles.headingTwo} {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className={styles.headingThree} {...props} />
            ),
            // 목록 스타일링 추가
            ul: ({ node, ...props }) => (
              <ul className={styles.bulletList} {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className={styles.numberedList} {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className={styles.listItem} {...props} />
            ),
            // 인용구 스타일링 추가
            blockquote: ({ node, ...props }) => (
              <blockquote className={styles.noteBlock} {...props} />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// Separate component for action buttons
const ActionButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) => (
  <button className={styles.actionButton} onClick={onClick}>
    {label}
  </button>
);

export default function Home() {
  const [hasResponse, setHasResponse] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1); // 타이틀 영역 투명도 상태 추가
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [typingEffectEnabled, setTypingEffectEnabled] = useState(true);

  useEffect(() => {
    // 새 메시지가 추가될 때 스크롤을 항상 맨 아래로 이동
    if (chatBoxRef.current) {
      // 약간의 지연 후 스크롤 - 렌더링 완료 보장
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, isLoading]); // isLoading도 의존성에 추가하여 로딩 상태 변경 시에도 스크롤 조정

  const handleSubmit = async (text: string) => {
    if (!text.trim()) return;

    const systemPrompt = {
      role: "system",
      content:
        "You are a helpful AI assistant who remembers the conversation and responds like a collaborative teammate.",
    };

    // Add new user input to previous conversation
    const updatedMessages = [...messages, { role: "user", content: text }];

    // Add system prompt to the beginning of all messages
    const fullMessages = [systemPrompt, ...updatedMessages];

    // Save messages without system prompt for display
    setMessages(updatedMessages);
    setIsLoading(true);

    // 메시지 전송 시 애니메이션 시작
    if (!hasResponse) {
      // 타이틀 영역 페이드 아웃 먼저 시작 (레이아웃 변화 전)
      setHeroOpacity(0);

      // 약간의 지연 후 애니메이션 시작
      setTimeout(() => {
        // 애니메이션 시작
        setIsAnimating(true);

        // 애니메이션이 완료된 후 최종 상태로 전환
        setTimeout(() => {
          setHasResponse(true);

          // 애니메이션이 끝나면 애니메이션 상태 해제
          setTimeout(() => {
            setIsAnimating(false);
          }, 100);
        }, 700); // 애니메이션 시간과 동일하게 설정
      }, 200); // 타이틀이 페이드 아웃된 후 애니메이션 시작
    }

    try {
      const res = await sendChat(fullMessages);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: res.content },
      ]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    // Implement functionality for each action button
    const actionPrompts = {
      "Solve with Auto Analysis":
        "Analyze this problem and provide a step-by-step solution:",
      "Talk with AI Partner": "I'd like to discuss a project idea with you:",
      Research: "Research this topic and provide a detailed overview:",
      Sora: "Generate a visual description of:",
      More: "I need more options for:",
    };

    if (actionPrompts[action]) {
      // Set placeholder or prefill input (implementation depends on TaskInput component)
      console.log(`Selected action: ${action}`);
    }
  };

  // 현재 상태에 따른 클래스 결정 함수
  const getContentClassName = () => {
    if (isAnimating) {
      return `${styles.mainContent} ${styles.animating}`;
    } else if (hasResponse) {
      return `${styles.mainContent} ${styles.chatActive}`;
    } else {
      return `${styles.mainContent} ${styles.centered}`;
    }
  };

  return (
    <main className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/">
            <h1 className={styles.logo}>AI TaskPilot</h1>
          </Link>
          <button className={styles.sidebarButton} aria-label="Toggle sidebar">
            <SidebarIcon />
          </button>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.searchButton} aria-label="Search">
            <SearchIcon />
          </button>
          <button className={styles.loginButton}>Log in</button>
        </div>
      </header>

      <div className={styles.mainWrapper}>
        {/* 히어로 섹션 - 항상 렌더링하되 투명도로 표시/숨김 제어 */}
        <div className={styles.heroSection} style={{ opacity: heroOpacity }}>
          <h1 className={styles.title}>AI TaskPilot</h1>
          <p className={styles.subTitle}>
            Tell us your task. We&apos;ll fly the best AIs for you
          </p>
        </div>

        {/* Chat messages area - 타이핑 이펙트 적용 */}
        {hasResponse && (
          <div className={styles.chatBox} ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <MessageBubble
                key={index}
                message={msg}
                typingEnabled={
                  // 마지막 AI 메시지에만 타이핑 이펙트 적용
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
        )}

        {/* 입력창 영역 */}
        <div className={getContentClassName()}>
          <div className={styles.inputSection}>
            <div className={styles.inputContainer}>
              <TaskInput onSubmit={handleSubmit} />
            </div>

            <div className={styles.actions}>
              {[
                "Solve with Auto Analysis",
                "Talk with AI Partner",
                "Research",
                "Sora",
                "More",
              ].map((action) => (
                <ActionButton
                  key={action}
                  label={action}
                  onClick={() => handleActionClick(action)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
