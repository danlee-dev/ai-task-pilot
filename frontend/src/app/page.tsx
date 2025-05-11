// src/app/page.tsx
"use client";
import styles from "./page.module.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/home/HeroSection";
import ChatBox from "@/components/chat/ChatBox";
import InputSection from "@/components/input/InputSection";
import { useChatState } from "@/hooks/useChatState";
import { useLayout } from "@/contexts/LayoutContext";

export default function Home() {
  const {
    messages,
    isLoading,
    isAnimating,
    hasResponse,
    heroOpacity,
    typingEffectEnabled,
    handleSubmit,
    handleActionClick,
  } = useChatState();

  const { isSidebarOpen } = useLayout();

  // CSS 클래스 결정
  const containerClass = isSidebarOpen
    ? `${styles.homeContainer} ${styles.shifted}`
    : styles.homeContainer;

  // 입력창의 상태에 따른 클래스 결정
  const getInputSectionClass = () => {
    if (isAnimating) {
      return styles.animating;
    } else if (hasResponse) {
      return styles.chatActive;
    } else {
      return styles.centered;
    }
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      <Sidebar />

      <main className={containerClass}>
        <div className={styles.mainWrapper}>
          {/* 로고 섹션 */}
          <div className={`${styles.logoContainer} ${hasResponse ? styles.fadeOutLogo : ''}`}>
            <HeroSection opacity={heroOpacity} />
          </div>

          {/* 채팅 메시지 영역 */}
          {hasResponse && (
            <div className={styles.chatBoxWrapper}>
              <ChatBox
                messages={messages}
                isLoading={isLoading}
                typingEffectEnabled={typingEffectEnabled}
              />
            </div>
          )}

          {/* 입력 섹션 */}
          <div className={`${styles.mainContent} ${getInputSectionClass()}`}>
            <InputSection
              onSubmit={handleSubmit}
              onActionClick={handleActionClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
