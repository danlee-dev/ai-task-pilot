// src/app/page.tsx
"use client";
import { useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/home/HeroSection";
import ChatBox from "@/components/chat/ChatBox";
import InputSection from "@/components/input/InputSection";
import { useLayout } from "@/contexts/LayoutContext";
import { useChat } from "@/contexts/ChatContext";

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
  } = useChat();

  const { isSidebarOpen, closeSidebar, windowWidth, isMobile, sidebarWidth } =
    useLayout();

  // 화면이 너무 좁아지면 사이드바 자동으로 닫기 (LayoutContext로 이동된 기능)
  useEffect(() => {
    if (windowWidth <= 768 && isSidebarOpen) {
      closeSidebar();
    }
  }, [windowWidth, isSidebarOpen, closeSidebar]);

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

  // 사이드바가 열려있을 때 메인 컨텐츠 영역 스타일 계산
  const getMainWrapperStyle = () => {
    if (isSidebarOpen && !isMobile) {
      return {
        maxWidth: `min(850px, calc(100% - 40px))`,
        marginLeft: `${sidebarWidth}px`,
      };
    }
    return {};
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      <Sidebar />

      <main className={containerClass}>
        <div className={styles.mainWrapper} style={getMainWrapperStyle()}>
          {/* 로고 섹션 */}
          <div
            className={`${styles.logoContainer} ${
              hasResponse ? styles.fadeOutLogo : ""
            }`}
          >
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
