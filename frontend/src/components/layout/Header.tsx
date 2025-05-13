import Link from "next/link";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import styles from "./Header.module.css";
import { useLayout } from "@/contexts/LayoutContext";
import { useChat } from "@/contexts/ChatContext";
import { MouseEvent, useState, useRef, useEffect } from "react";

const Header: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useLayout();
  const { currentAiModel, switchAiModel, isLoading } = useChat();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const headerClass = isSidebarOpen
    ? `${styles.header} ${styles.shifted}`
    : styles.header;

  // 모델 전환 핸들러 추가
  const handleSwitchModel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const targetModel = currentAiModel === "gpt" ? "claude" : "gpt";
    switchAiModel(targetModel);
  };

  // 검색창 토글
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("검색어:", searchQuery);
      // TODO: 실제 검색 기능 구현
      // 예: router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // 검색창 외부 클릭 시 닫기
  useEffect(() => {
    if (isSearchOpen) {
      // 검색창이 열리면 input에 포커스
      searchInputRef.current?.focus();

      // 외부 클릭 감지
      const handleClickOutside = (event: MouseEvent<Document>) => {
        setTimeout(() => {
          if (
            searchInputRef.current &&
            !searchInputRef.current.contains(event.target as Node)
          ) {
            setIsSearchOpen(false);
          }
        }, 0);
      };

      document.addEventListener(
        "click",
        handleClickOutside as unknown as EventListener
      );
      return () => {
        document.removeEventListener(
          "click",
          handleClickOutside as unknown as EventListener
        );
      };
    }
  }, [isSearchOpen]);

  return (
    <header className={headerClass}>
      <div className={styles.headerLeft}>
        <button
          className={styles.sidebarButton}
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </button>
        {!isSidebarOpen && (
          <Link href="/" className={styles.headerLogo}>
            <span className={styles.logoText}>TaskPilot</span>
          </Link>
        )}
      </div>
      <div className={styles.headerRight}>
        <button
          className={styles.aiSwitchButton}
          onClick={handleSwitchModel}
          disabled={isLoading}
          aria-label={`현재 AI: ${currentAiModel}. 클릭하여 ${
            currentAiModel === "gpt" ? "Claude" : "GPT"
          }로 전환`}
        >
          <span className={`${styles.aiIcon} ${styles[currentAiModel]}`}>
            {currentAiModel === "gpt" ? "GPT" : "Claude"}
          </span>
          <span className={styles.switchText}>
            Switch to {currentAiModel === "gpt" ? "Claude" : "GPT"}
          </span>
        </button>
        <div className={styles.searchContainer}>
          <button
            className={styles.searchButton}
            aria-label="Search"
            onClick={toggleSearch}
          >
            <SearchIcon />
          </button>
          {isSearchOpen && (
            <div className={styles.searchModal}>
              <form onSubmit={handleSearch}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="대화 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  type="submit"
                  className={styles.searchSubmitButton}
                  disabled={!searchQuery.trim()}
                >
                  <SearchIcon />
                </button>
              </form>
            </div>
          )}
        </div>
        <Link href="/login">
          <button className={styles.loginButton}>Log in</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
