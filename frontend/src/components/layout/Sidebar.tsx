import React, { useState, useRef, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";

// 아이콘 컴포넌트 임포트
import ChatIcon from "../icons/ChatIcon";
import PlusIcon from "../icons/PlusIcon";
import DotsIcon from "../icons/DotsIcon";
import LightbulbIcon from "../icons/LightbulbIcon";
import CodeIcon from "../icons/CodeIcon";
import BookIcon from "../icons/BookIcon";
import StarIcon from "../icons/StarIcon";
import SettingsIcon from "../icons/SettingsIcon";
import LogoutIcon from "../icons/LogoutIcon";
import SidebarIcon from "../icons/SidebarIcon";

// 템플릿 데이터 타입 정의
interface PromptTemplate {
  id: string;
  title: string;
  icon: React.ReactNode;
  prompt: string;
  starred?: boolean;
}

// 템플릿 데이터 초기값
const initialPromptTemplates: PromptTemplate[] = [
  {
    id: "t1",
    title: "Code Review",
    icon: <CodeIcon />,
    prompt: "Please review the following code and suggest improvements:",
  },
  {
    id: "t2",
    title: "Concept Explanation",
    icon: <BookIcon />,
    prompt: "Please explain the following concept in detail:",
  },
  {
    id: "t3",
    title: "Idea Brainstorming",
    icon: <LightbulbIcon />,
    prompt: "Please suggest 5 ideas for the following topic:",
  },
];

// 채팅 및 폴더 리스트 데이터
const recentChats = [
  { id: "r1", name: "Clarification Request", icon: <ChatIcon /> },
  { id: "r2", name: "User Input Clarification", icon: <ChatIcon /> },
  { id: "r3", name: "New chat", icon: <ChatIcon /> },
];

const olderChats = [
  { id: "y1", name: "Clarification Request", icon: <ChatIcon /> },
  { id: "y2", name: "User Input Clarification", icon: <ChatIcon /> },
];

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar, toggleSidebar, sidebarWidth } =
    useLayout();
  const [activeChatId, setActiveChatId] = useState("r1");
  const [expandedSections, setExpandedSections] = useState({
    templates: true,
    today: true,
    yesterday: true,
    pastWeek: true,
  });
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // 로컬 스토리지에서 템플릿 상태 로드
  useEffect(() => {
    const savedTemplates = localStorage.getItem("starredTemplates");
    if (savedTemplates) {
      try {
        const savedStarredIds = JSON.parse(savedTemplates) as string[];
        const templatesWithStarred = initialPromptTemplates.map((template) => ({
          ...template,
          starred: savedStarredIds.includes(template.id),
        }));
        setPromptTemplates(sortTemplatesByStarred(templatesWithStarred));
      } catch (error) {
        console.error("Error loading template state:", error);
        setPromptTemplates(initialPromptTemplates);
      }
    } else {
      setPromptTemplates(initialPromptTemplates);
    }
  }, []);

  // 별표 표시된 템플릿을 위쪽으로 정렬하는 함수
  const sortTemplatesByStarred = (
    templates: PromptTemplate[]
  ): PromptTemplate[] => {
    return [...templates].sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return 0;
    });
  };

  // 별표 상태 토글 함수
  const toggleStarred = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되는 것을 방지

    const updatedTemplates = promptTemplates.map((template) => {
      if (template.id === templateId) {
        return { ...template, starred: !template.starred };
      }
      return template;
    });

    // 별표 상태 정렬 및 업데이트
    const sortedTemplates = sortTemplatesByStarred(updatedTemplates);
    setPromptTemplates(sortedTemplates);

    // 별표 표시된 템플릿 ID 목록 저장
    const starredIds = sortedTemplates
      .filter((template) => template.starred)
      .map((template) => template.id);

    localStorage.setItem("starredTemplates", JSON.stringify(starredIds));
  };

  const toggleSection = (
    section: "templates" | "today" | "yesterday" | "pastWeek"
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sidebarClass = isSidebarOpen
    ? `${styles.sidebar} ${styles.open}`
    : styles.sidebar;

  // 사이드바 인라인 스타일 추가
  const sidebarStyle = {
    width: `${sidebarWidth}px`,
    left: isSidebarOpen ? 0 : `-${sidebarWidth}px`,
  };

  const handleChatClick = (id: string) => {
    setActiveChatId(id);
    // 모바일에서 자동으로 사이드바 닫는 기능 제거
    // if (window.innerWidth <= 768) {
    //   closeSidebar();
    // }
  };

  const handleTemplateClick = (prompt: string) => {
    // TODO: 프롬프트를 입력창에 추가하는 로직 구현
    console.log("템플릿 선택:", prompt);
    // 모바일에서 자동으로 사이드바 닫는 기능 제거
    // if (window.innerWidth <= 768) {
    //   closeSidebar();
    // }
  };

  // 유저 메뉴 토글
  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // 외부 클릭 감지 - 유저 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        userButtonRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* 백드롭과 사이드바 컨테이너를 감싸는 div */}
      <div className={isSidebarOpen ? styles.sidebarContainer : ""}>
        {/* 백드롭 */}
        {isSidebarOpen && (
          <div
            className={styles.backdrop}
            onClick={(e) => {
              e.preventDefault(); // 기본 동작 방지
              e.stopPropagation(); // 이벤트 버블링 방지
              console.log("백드롭 클릭");
              // 다른 이벤트 발생 전에 직접 닫기
              closeSidebar();
            }}
          />
        )}

        {/* 사이드바 */}
        <div
          className={sidebarClass}
          style={sidebarStyle}
          onClick={(e) => e.stopPropagation()} // 사이드바 내부 클릭이 백드롭으로 전달되지 않도록 방지
        >
          <div className={styles.sidebarContent}>
            {/* 상단 헤더 영역: 로고와 토글 버튼 표시 */}
            <div className={styles.sidebarHeader}>
              {/* 토글 버튼 - 헤더의 토글 버튼과 동일한 기능 */}
              <button
                className={styles.sidebarToggleButton}
                onClick={(e) => {
                  e.preventDefault(); // 기본 이벤트 방지
                  e.stopPropagation(); // 이벤트 버블링 방지
                  console.log("사이드바 내부 토글 버튼 클릭");
                  toggleSidebar();
                }}
              >
                <SidebarIcon />
              </button>

              {/* 앱 로고 - 헤더의 로고 위치와 정확히 일치하도록 조정 */}
              <div className={styles.logoWrapper}>
                <div className={styles.appLogo}>
                  <span className={styles.logoText}>TaskPilot</span>
                </div>
              </div>
            </div>

            {/* 새 채팅 버튼 */}
            <button className={styles.newChatButton}>
              <PlusIcon />
              <span>New chat</span>
            </button>

            {/* 검색 입력창 */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search conversations..."
                className={styles.searchInput}
              />
            </div>

            {/* 프롬프트 템플릿 섹션 */}
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection("templates")}
            >
              <div className={styles.sectionTitle}>
                <span
                  className={`${styles.expandIcon} ${
                    expandedSections.templates ? styles.expanded : ""
                  }`}
                >
                  ▶
                </span>
                Frequently Used Templates
              </div>
              <button className={styles.moreButton}>
                <DotsIcon />
              </button>
            </div>

            {expandedSections.templates && (
              <div className={styles.templatesContainer}>
                {promptTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={styles.templateCard}
                    onClick={() => handleTemplateClick(template.prompt)}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                  >
                    <div className={styles.templateIcon}>{template.icon}</div>
                    <div className={styles.templateInfo}>
                      <span className={styles.templateTitle}>
                        {template.title}
                      </span>
                      {hoveredTemplate === template.id && (
                        <div className={styles.templateHint}>Click to use</div>
                      )}
                    </div>
                    <div
                      className={`${styles.starButton} ${
                        template.starred ? styles.starred : ""
                      }`}
                      onClick={(e) => toggleStarred(e, template.id)}
                    >
                      <StarIcon />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 오늘 섹션 */}
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection("today")}
            >
              <div className={styles.sectionTitle}>
                <span
                  className={`${styles.expandIcon} ${
                    expandedSections.today ? styles.expanded : ""
                  }`}
                >
                  ▶
                </span>
                Today
              </div>
              <button className={styles.moreButton}>
                <DotsIcon />
              </button>
            </div>

            {expandedSections.today && (
              <div className={styles.listContainer}>
                <ul className={styles.itemList}>
                  {recentChats.map((chat) => (
                    <li
                      key={chat.id}
                      className={`${styles.listItem} ${
                        activeChatId === chat.id ? styles.active : ""
                      }`}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <Link
                        href={`/chat/${chat.id}`}
                        className={styles.itemLink}
                      >
                        <span className={styles.itemIcon}>{chat.icon}</span>
                        <span className={styles.itemText}>{chat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 어제 섹션 */}
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection("yesterday")}
            >
              <div className={styles.sectionTitle}>
                <span
                  className={`${styles.expandIcon} ${
                    expandedSections.yesterday ? styles.expanded : ""
                  }`}
                >
                  ▶
                </span>
                Yesterday
              </div>
              <button className={styles.moreButton}>
                <DotsIcon />
              </button>
            </div>

            {expandedSections.yesterday && (
              <div className={styles.listContainer}>
                <ul className={styles.itemList}>
                  {olderChats.map((chat) => (
                    <li
                      key={chat.id}
                      className={`${styles.listItem} ${
                        activeChatId === chat.id ? styles.active : ""
                      }`}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <Link
                        href={`/chat/${chat.id}`}
                        className={styles.itemLink}
                      >
                        <span className={styles.itemIcon}>{chat.icon}</span>
                        <span className={styles.itemText}>{chat.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 지난 주 섹션 */}
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection("pastWeek")}
            >
              <div className={styles.sectionTitle}>
                <span
                  className={`${styles.expandIcon} ${
                    expandedSections.pastWeek ? styles.expanded : ""
                  }`}
                >
                  ▶
                </span>
                Last Week
              </div>
              <button className={styles.moreButton}>
                <DotsIcon />
              </button>
            </div>

            {expandedSections.pastWeek && (
              <div className={styles.listContainer}>
                <ul className={styles.itemList}>
                  {/* 지난 주 채팅 목록 추가 */}
                </ul>
              </div>
            )}

            {/* 하단의 유저 섹션 추가 */}
            <div className={styles.userSection}>
              <div className={styles.userProfileContainer}>
                <button
                  className={styles.userButton}
                  onClick={toggleUserMenu}
                  ref={userButtonRef}
                >
                  <div className={styles.userAvatar}>TP</div>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>User</span>
                    <span className={styles.userPlan}>Free Plan</span>
                  </div>
                  <DotsIcon />
                </button>

                {/* 유저 메뉴 드롭다운 */}
                {isUserMenuOpen && (
                  <div className={styles.userMenu} ref={userMenuRef}>
                    <div className={styles.userMenuHeader}>
                      <span className={styles.userMenuEmail}>
                        user@example.com
                      </span>
                    </div>
                    <hr className={styles.userMenuDivider} />
                    <ul className={styles.userMenuList}>
                      <li className={styles.userMenuItem}>
                        <Link href="/settings" className={styles.userMenuLink}>
                          <SettingsIcon />
                          <span>Settings</span>
                        </Link>
                      </li>
                      <li className={styles.userMenuItem}>
                        <Link href="/logout" className={styles.userMenuLink}>
                          <LogoutIcon />
                          <span>Logout</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
