// src/components/input/InputSection.tsx
import TaskInput from "./TaskInput";
import ActionBar from "@/components/actions/ActionBar";
import styles from "./InputSection.module.css";
import { useChat } from "@/contexts/ChatContext";

interface InputSectionProps {
  onSubmit: (text: string) => void;
  onActionClick: (action: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  onActionClick,
}) => {
  const { currentAiModel, switchAiModel } = useChat();

  return (
    <>
      <div className={styles.inputContainer}>
        <div className={styles.modelToggle}>
          <button
            onClick={() => switchAiModel("gpt")}
            className={`${styles.modelBtn} ${
              currentAiModel === "gpt" ? styles.active : ""
            }`}
          >
            OpenAI
          </button>
          <button
            onClick={() => switchAiModel("claude")}
            className={`${styles.modelBtn} ${
              currentAiModel === "claude" ? styles.active : ""
            }`}
          >
            Claude
          </button>
          <span className={styles.shortcutHint}>Switch with Option + Tab</span>
        </div>
        <TaskInput onSubmit={onSubmit} />
      </div>
      <ActionBar onActionClick={onActionClick} />
    </>
  );
};

export default InputSection;
