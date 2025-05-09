"use client";
import styles from "./page.module.css";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import TaskInput from "@/components/TaskInput";

export default function Home() {
  const handleSubmit = (text: string) => {
    console.log("사용자가 입력한 텍스트:", text);
    // 여기에 API 호출 등 원하는 동작 추가
  };
  return (
    <main className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>AI TaskPilot</h1>
          <button className={styles.sidebarButton}>
            <SidebarIcon size={18} color="#a19d9db4"/>
          </button>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.searchButton}>
            <SearchIcon size={18} color="#a19d9db4"/>
          </button>
          <button className={styles.loginButton}>
            Log in
          </button>
        </div>
      </header>

      {/* Main Section */}
      <section className={styles.mainContent}>
        <h2 className={styles.title}>What can I help with?</h2>
        <div className={styles.inputContainer}>
          <TaskInput onSubmit={handleSubmit} />
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton}>Search with ChatGPT</button>
          <button className={styles.actionButton}>Talk with ChatGPT</button>
          <button className={styles.actionButton}>Research</button>
          <button className={styles.actionButton}>Sora</button>
          <button className={styles.actionButton}>More</button>
        </div>
      </section>
    </main>
  );
}
