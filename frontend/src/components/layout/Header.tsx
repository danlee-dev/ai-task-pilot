import Link from "next/link";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import styles from "./Header.module.css"; // 스타일 분리

interface HeaderProps {
  title?: string; // 선택적 제목
  className?: string;
}

const Header: React.FC<HeaderProps> = () => {
  return (
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
        <Link href="/login">
          <button className={styles.loginButton}>Log in</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
