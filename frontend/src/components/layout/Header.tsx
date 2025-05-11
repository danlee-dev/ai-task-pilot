import Link from "next/link";
import SidebarIcon from "@/components/icons/SidebarIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import styles from "./Header.module.css";
import { useLayout } from "@/contexts/LayoutContext";

const Header: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useLayout();

  const headerClass = isSidebarOpen
    ? `${styles.header} ${styles.shifted}`
    : styles.header;

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
        <Link href="/">
          <h1 className={styles.logo}>AI TaskPilot</h1>
        </Link>
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
