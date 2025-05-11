import React, { useState, useRef, useEffect } from 'react';
import styles from './Sidebar.module.css';
import Link from 'next/link';
import { useLayout } from '@/contexts/LayoutContext';

// 아이콘 컴포넌트
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6M10 22h4M12 2v1M4.93 4.93l.7.7M2 12h1M19.07 4.93l-.7.7M22 12h-1M16 5.25C16 7.45 12 10 12 10s-4-2.55-4-4.75C8 3.45 9.79 2 12 2s4 1.45 4 3.25z" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// 새로운 아이콘 컴포넌트 추가
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

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
  { id: 't1', title: '코드 리뷰 및 개선', icon: <CodeIcon />, prompt: '다음 코드를 검토하고 개선점을 제안해주세요:' },
  { id: 't2', title: '개념 설명', icon: <BookIcon />, prompt: '다음 개념에 대해 자세히 설명해주세요:' },
  { id: 't3', title: '아이디어 브레인스토밍', icon: <LightbulbIcon />, prompt: '다음 주제에 대한 아이디어를 5개 제안해주세요:' }
];

// 채팅 및 폴더 리스트 데이터
const recentChats = [
  { id: 'r1', name: 'Clarification Request', icon: <ChatIcon /> },
  { id: 'r2', name: 'User Input Clarification', icon: <ChatIcon /> },
  { id: 'r3', name: 'New chat', icon: <ChatIcon /> }
];

const olderChats = [
  { id: 'y1', name: 'Clarification Request', icon: <ChatIcon /> },
  { id: 'y2', name: 'User Input Clarification', icon: <ChatIcon /> }
];

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useLayout();
  const [activeChatId, setActiveChatId] = useState('r1');
  const [expandedSections, setExpandedSections] = useState({
    templates: true,
    today: true,
    yesterday: true,
    pastWeek: true
  });
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // 로컬 스토리지에서 템플릿 상태 로드
  useEffect(() => {
    const savedTemplates = localStorage.getItem('starredTemplates');
    if (savedTemplates) {
      try {
        const savedStarredIds = JSON.parse(savedTemplates) as string[];
        const templatesWithStarred = initialPromptTemplates.map(template => ({
          ...template,
          starred: savedStarredIds.includes(template.id)
        }));
        setPromptTemplates(sortTemplatesByStarred(templatesWithStarred));
      } catch (error) {
        console.error('템플릿 상태를 불러오는 중 오류가 발생했습니다:', error);
        setPromptTemplates(initialPromptTemplates);
      }
    } else {
      setPromptTemplates(initialPromptTemplates);
    }
  }, []);

  // 별표 표시된 템플릿을 위쪽으로 정렬하는 함수
  const sortTemplatesByStarred = (templates: PromptTemplate[]): PromptTemplate[] => {
    return [...templates].sort((a, b) => {
      if (a.starred && !b.starred) return -1;
      if (!a.starred && b.starred) return 1;
      return 0;
    });
  };

  // 별표 상태 토글 함수
  const toggleStarred = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되는 것을 방지

    const updatedTemplates = promptTemplates.map(template => {
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
      .filter(template => template.starred)
      .map(template => template.id);

    localStorage.setItem('starredTemplates', JSON.stringify(starredIds));
  };

  const toggleSection = (section: 'templates' | 'today' | 'yesterday' | 'pastWeek') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarClass = isSidebarOpen
    ? `${styles.sidebar} ${styles.open}`
    : styles.sidebar;

  const handleChatClick = (id: string) => {
    setActiveChatId(id);
    // 모바일에서는 채팅 선택 시, 사이드바 닫기
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  const handleTemplateClick = (prompt: string) => {
    // TODO: 프롬프트를 입력창에 추가하는 로직 구현
    console.log('템플릿 선택:', prompt);
    // 모바일에서는 템플릿 선택 시, 사이드바 닫기
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {isSidebarOpen && <div className={styles.backdrop} onClick={closeSidebar}></div>}
      <div className={sidebarClass}>
        <div className={styles.sidebarContent}>
          {/* 앱 로고 */}
          <div className={styles.logoWrapper}>
            <div className={styles.appLogo}>
              <span className={styles.logoText}>TaskPilot</span>
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
            onClick={() => toggleSection('templates')}
          >
            <div className={styles.sectionTitle}>
              <span className={`${styles.expandIcon} ${expandedSections.templates ? styles.expanded : ''}`}>▶</span>
              자주 사용하는 템플릿
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
                  <div className={styles.templateIcon}>
                    {template.icon}
                  </div>
                  <div className={styles.templateInfo}>
                    <span className={styles.templateTitle}>{template.title}</span>
                    {hoveredTemplate === template.id && (
                      <div className={styles.templateHint}>클릭하여 사용</div>
                    )}
                  </div>
                  <div
                    className={`${styles.starButton} ${template.starred ? styles.starred : ''}`}
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
            onClick={() => toggleSection('today')}
          >
            <div className={styles.sectionTitle}>
              <span className={`${styles.expandIcon} ${expandedSections.today ? styles.expanded : ''}`}>▶</span>
              오늘
            </div>
            <button className={styles.moreButton}>
              <DotsIcon />
            </button>
          </div>

          {expandedSections.today && (
            <div className={styles.listContainer}>
              <ul className={styles.itemList}>
                {recentChats.map(chat => (
                  <li
                    key={chat.id}
                    className={`${styles.listItem} ${activeChatId === chat.id ? styles.active : ''}`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <Link href={`/chat/${chat.id}`} className={styles.itemLink}>
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
            onClick={() => toggleSection('yesterday')}
          >
            <div className={styles.sectionTitle}>
              <span className={`${styles.expandIcon} ${expandedSections.yesterday ? styles.expanded : ''}`}>▶</span>
              어제
            </div>
            <button className={styles.moreButton}>
              <DotsIcon />
            </button>
          </div>

          {expandedSections.yesterday && (
            <div className={styles.listContainer}>
              <ul className={styles.itemList}>
                {olderChats.map(chat => (
                  <li
                    key={chat.id}
                    className={`${styles.listItem} ${activeChatId === chat.id ? styles.active : ''}`}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    <Link href={`/chat/${chat.id}`} className={styles.itemLink}>
                      <span className={styles.itemIcon}>{chat.icon}</span>
                      <span className={styles.itemText}>{chat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 이전 7일 섹션 */}
          <div
            className={styles.sectionHeader}
            onClick={() => toggleSection('pastWeek')}
          >
            <div className={styles.sectionTitle}>
              <span className={`${styles.expandIcon} ${expandedSections.pastWeek ? styles.expanded : ''}`}>▶</span>
              지난 7일
            </div>
          </div>

          {/* 폴더 섹션 */}
          <div className={styles.foldersSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>폴더</div>
              <button className={`${styles.addButton} ${styles.moreButton}`}>
                <PlusIcon />
              </button>
            </div>
            <div className={styles.foldersList}>
              <div className={styles.folderItem}>
                <FolderIcon />
                <span>프로젝트</span>
              </div>
              <div className={styles.folderItem}>
                <FolderIcon />
                <span>개인 메모</span>
              </div>
            </div>
          </div>

          {/* 사용자 섹션 */}
          <div className={styles.userSection}>
            <div className={styles.userProfileContainer}>
              <button
                ref={userButtonRef}
                className={styles.userButton}
              >
                <div className={styles.userAvatar}>SM</div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>Seongmin Lee</span>
                  <span className={styles.userPlan}>Free Plan</span>
                </div>
                <div onClick={toggleUserMenu}>
                  <DotsIcon />
                </div>
              </button>

              {isUserMenuOpen && (
                <div className={styles.userMenu} ref={userMenuRef}>
                  <div className={styles.userMenuHeader}>
                    <span className={styles.userMenuEmail}>fnseongmin11@gmail.com</span>
                  </div>
                  <div className={styles.userMenuDivider}></div>
                  <ul className={styles.userMenuList}>
                    <li className={styles.userMenuItem}>
                      <Link href="/settings" className={styles.userMenuLink}>
                        <SettingsIcon />
                        <span>설정</span>
                      </Link>
                    </li>
                    <li className={styles.userMenuItem}>
                      <Link href="/logout" className={styles.userMenuLink}>
                        <LogoutIcon />
                        <span>로그아웃</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
