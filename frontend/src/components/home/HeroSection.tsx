// 2. src/components/home/HeroSection.tsx
import { CSSProperties } from "react";
import styles from "./HeroSection.module.css"; // 스타일 분리

interface HeroSectionProps {
  opacity: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ opacity }) => {
  const style: CSSProperties = { opacity };

  return (
    <div className={styles.heroSection} style={style}>
      <h1 className={styles.title}>AI TaskPilot</h1>
      <p className={styles.subTitle}>
        Tell us your task. We&apos;ll fly the best AIs for you
      </p>
    </div>
  );
};

export default HeroSection;
