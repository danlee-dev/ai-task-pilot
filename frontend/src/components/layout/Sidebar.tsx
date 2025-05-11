import styles from './Sidebar.module.css';
import Link from 'next/link';
import { useLayout } from '@/contexts/LayoutContext';

// 채팅 및 폴더 리스트 데이터
const recentChats = [
  { id: 'r1', name: 'Clarification Request', icon: '' },
  { id: 'r2', name: 'User Input Clarification', icon: '' },
  { id: 'r3', name: 'New chat', icon: '' }
];

const olderChats = [
  { id: 'y1', name: 'Clarification Request', icon: '' },
  { id: 'y2', name: 'User Input Clarification', icon: '' }
];

export default function Sidebar() {
  const { isSidebarOpen } = useLayout();

  const sidebarClass = isSidebarOpen
    ? `${styles.sidebar} ${styles.open}`
    : styles.sidebar;

  return (
    <div className={sidebarClass}>
      <div className={styles.sidebarContent}>
        {/* 새 채팅 버튼 */}
        <button className={styles.newChatButton}>
          <svg className={styles.newChatIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New chat
        </button>

        {/* 오늘 섹션 */}
        <div className={styles.sectionHeader}>
          오늘
          <svg className={styles.moreButton} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>

        <div className={styles.listContainer}>
          <ul className={styles.itemList}>
            {recentChats.map(chat => (
              <li key={chat.id} className={styles.listItem}>
                <Link href={`/chat/${chat.id}`} className={styles.itemLink}>
                  <span className={styles.itemIcon}>{chat.icon}</span>
                  {chat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 어제 섹션 */}
        <div className={styles.sectionHeader}>
          어제
          <svg className={styles.moreButton} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </div>

        <div className={styles.listContainer}>
          <ul className={styles.itemList}>
            {olderChats.map(chat => (
              <li key={chat.id} className={styles.listItem}>
                <Link href={`/chat/${chat.id}`} className={styles.itemLink}>
                  <span className={styles.itemIcon}>{chat.icon}</span>
                  {chat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 이전 7일 섹션 */}
        <div className={styles.sectionHeader}>
          지난 7일
        </div>

        {/* 사용자 섹션 */}
        <div className={styles.userSection}>
          <button className={styles.userButton}>
            <div className={styles.userAvatar}>SM</div>
            <span className={styles.userName}>Seongmin Lee</span>
            <svg className={styles.moreButton} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
