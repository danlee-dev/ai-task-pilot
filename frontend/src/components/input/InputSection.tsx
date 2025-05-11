// 7. src/components/input/InputSection.tsx
import TaskInput from "@/components/TaskInput";
import ActionBar from "@/components/actions/ActionBar";
import styles from "./InputSection.module.css"; // 스타일 분리

interface InputSectionProps {
  onSubmit: (text: string) => void;
  onActionClick: (action: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  onActionClick,
}) => {
  return (
    <div className={styles.inputSection}>
      <div className={styles.inputContainer}>
        <TaskInput onSubmit={onSubmit} />
      </div>
      <ActionBar onActionClick={onActionClick} />
    </div>
  );
};

export default InputSection;
