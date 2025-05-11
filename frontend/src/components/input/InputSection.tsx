// src/components/input/InputSection.tsx
import TaskInput from "@/components/TaskInput";
import ActionBar from "@/components/actions/ActionBar";
import styles from "./InputSection.module.css";

interface InputSectionProps {
  onSubmit: (text: string) => void;
  onActionClick: (action: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  onActionClick,
}) => {
  return (
    <>
      <div className={styles.inputContainer}>
        <TaskInput onSubmit={onSubmit} />
      </div>
      <ActionBar onActionClick={onActionClick} />
    </>
  );
};

export default InputSection;
