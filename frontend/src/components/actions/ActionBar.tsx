
// 6. src/components/actions/ActionBar.tsx
import ActionButton from "./ActionButton";
import styles from "./ActionBar.module.css"; // 스타일 분리

interface ActionBarProps {
  onActionClick: (action: string) => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ onActionClick }) => {
  // 액션 버튼 목록
  const actionButtons = [
    "Solve with Auto Analysis",
    "Talk with AI Partner",
    "Research",
    "Sora",
    "More",
  ];

  return (
    <div className={styles.actions}>
      {actionButtons.map((action) => (
        <ActionButton
          key={action}
          label={action}
          onClick={() => onActionClick(action)}
        />
      ))}
    </div>
  );
};

export default ActionBar;
