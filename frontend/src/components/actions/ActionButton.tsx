// 5. src/components/actions/ActionButton.tsx
import styles from "./ActionButton.module.css"; // 스타일 분리

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, onClick }) => (
  <button className={styles.actionButton} onClick={onClick}>
    {label}
  </button>
);

export default ActionButton;

