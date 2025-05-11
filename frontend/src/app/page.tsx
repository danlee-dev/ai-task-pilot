// src/app/page.tsx
"use client";
import styles from "./page.module.css";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import ChatBox from "@/components/chat/ChatBox";
import InputSection from "@/components/input/InputSection";
import { useChatState } from "@/hooks/useChatState";

export default function Home() {
  const {
    messages,
    isLoading,
    hasResponse,
    isAnimating,
    heroOpacity,
    typingEffectEnabled,
    handleSubmit,
    handleActionClick,
  } = useChatState();

  // 현재 상태에 따른 클래스 결정
  const getContentClassName = (): string => {
    if (isAnimating) {
      return `${styles.mainContent} ${styles.animating}`;
    } else if (hasResponse) {
      return `${styles.mainContent} ${styles.chatActive}`;
    }
    return `${styles.mainContent} ${styles.centered}`;
  };

  return (
    <main className={styles.homeContainer}>
      <Header />

      <div className={styles.mainWrapper}>
        {/* 히어로 섹션 - 항상 표시하되 opacity로 제어 */}
        <HeroSection opacity={heroOpacity} />

        {/* 채팅 메시지 영역 */}
        {hasResponse && (
          <ChatBox
            messages={messages}
            isLoading={isLoading}
            typingEffectEnabled={typingEffectEnabled}
          />
        )}

        {/* 입력창 영역 */}
        <div className={getContentClassName()}>
          <InputSection
            onSubmit={handleSubmit}
            onActionClick={handleActionClick}
          />
        </div>
      </div>
    </main>
  );
}
