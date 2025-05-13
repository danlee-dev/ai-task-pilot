"use client";
import { useEffect, useRef, useState } from "react";
import ArrowUpIcon from "../icons/ArrowUpIcon";
import styles from "./TaskInput.module.css";

const placeholders = [
  "Brainstorm podcast episode ideas",
  "Best cricket bat for beginners",
  "Translate this to Korean",
  "Describe a surreal dream",
  "Write a haiku about summer",
];

export default function TaskInput({
  onSubmit,
  onInputStart, // 입력 시작 시 호출될 함수 추가
}: {
  onSubmit: (value: string) => void;
  onInputStart?: () => void; // 옵셔널 prop
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [isComposing, setIsComposing] = useState(false); // 한글 조합 중 여부
  const [activeTab, setActiveTab] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false); // 입력 시작 여부 상태 추가
  const labels = ["auto", "select"];

  // Placeholder animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setAnimate(true);
      }, 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 자동 리사이즈
  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      // 첫 입력 감지
      if (!hasStartedTyping && el.value.trim().length > 0) {
        setHasStartedTyping(true);
        // 입력 시작 이벤트 발생
        if (onInputStart) {
          onInputStart();
        }
      }

      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  // Submit 처리
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = textareaRef.current?.value.trim();
    if (value) {
      onSubmit(value);
      textareaRef.current!.value = "";
      textareaRef.current!.style.height = "auto";
      // 입력 완료 후에도 typing 상태는 유지 (이미 UI가 변경됨)
    }
  };

  return (
    <form className={styles.inputWrapper} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} ${
          animate ? styles.animatePlaceholder : ""
        }`}
        placeholder={placeholders[placeholderIndex]}
        rows={1}
        onInput={handleInput}
        onChange={handleInput} // onChange 이벤트도 추가하여 텍스트 입력 감지 강화
        onCompositionStart={() => setIsComposing(true)} // 조합 시작
        onCompositionEnd={() => setIsComposing(false)} // 조합 끝
        onKeyDown={(e) => {
          if (isComposing) return; // 한글 조합 중이면 무시
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            (e.currentTarget.form as HTMLFormElement)?.requestSubmit();
          }
        }}
      />
      <div className={styles.underChatbox}>
        <div className={styles.toggleBtn}>
          <div
            className={styles.indicator}
            style={{ transform: `translateX(${activeTab * 100}%)` }}
          />
          {labels.map((label, i) => (
            <button
              key={label}
              className={activeTab === i ? styles.active : ""}
              onClick={() => setActiveTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.sendButton}
          onClick={() => {
            (textareaRef.current?.form as HTMLFormElement)?.requestSubmit();
          }}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </form>
  );
}
