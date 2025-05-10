"use client";
import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import TaskInput from "@/components/TaskInput";
import { sendChat } from "@/utils/api";

export default function Home() {
  const [hasResponse, setHasResponse] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const handleSubmit = async (text: string) => {
    // 사용자가 보낸 메시지 추가
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setHasResponse(true);
    // GPT 응답 받기
    const res = await sendChat([{ role: "user", content: text }]);

    // GPT 응답 메시지도 추가
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: res.content },
    ]);
  };

  return (
    <main className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/">
            <h1 className={styles.logo}>AI TaskPilot</h1>
          </Link>
          <button className={styles.sidebarButton}>
            <SidebarIcon />
          </button>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.searchButton}>
            <SearchIcon />
          </button>
          <button className={styles.loginButton}>Log in</button>
        </div>
      </header>

      <div className={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.role === "user" ? styles.userBubble : styles.botBubble
            }
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Main Section */}
      <section
        className={`${styles.mainContent} ${
          hasResponse ? styles.alignBottom : styles.alignCenter
        }`}
      >
        <div className={styles.upperSection}>
          <h1 className={styles.title}>AI TaskPilot</h1>
          <p className={styles.subTitle}>
            Tell us your task. We&apos;ll fly the best AIs for you
          </p>
        </div>
        <div className={styles.underSection}>
          <div className={styles.inputContainer}>
            <TaskInput onSubmit={handleSubmit} />
          </div>

          <div className={styles.actions}>
            <button className={styles.actionButton}>
              Solve with Auto Analysis
            </button>
            <button className={styles.actionButton}>
              Talk with AI Partner
            </button>
            <button className={styles.actionButton}>Research</button>
            <button className={styles.actionButton}>Sora</button>
            <button className={styles.actionButton}>More</button>
          </div>
        </div>
      </section>
    </main>
  );
}
