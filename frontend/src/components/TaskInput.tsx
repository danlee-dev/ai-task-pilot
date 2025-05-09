"use client";
import { useEffect, useRef, useState } from "react";
import ArrowUpIcon from "./icons/ArrowUpIcon";
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
}: {
  onSubmit: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false); // 초기값

    const interval = setInterval(() => {
      setAnimate(false); // 사라짐 준비 (아래로 초기화)

      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setAnimate(true); // 보여지기 시작 (위로 올라옴)
      }, 100); // 빠르게 교체

    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = textareaRef.current?.value.trim();
      if (value) {
        onSubmit(value);
        textareaRef.current!.value = ""; //'!' : Non-null assertion op -> obviously textareaRef.current is not NULL(When use ts)
        textareaRef.current!.style.height = "auto";
      }
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <label className={styles.inputWrapper} htmlFor="userTask">
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} ${animate ? styles.animatePlaceholder : ""}`}
        placeholder={placeholders[placeholderIndex]}
        rows={1}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
      <button
        type="button"
        className={styles.sendButton}
        onClick={() => {
          const value = textareaRef.current?.value.trim();
          if (value) {
            onSubmit(value);
            textareaRef.current!.value = "";
            textareaRef.current!.style.height = "auto";
          }
        }}
      >
        <ArrowUpIcon />
      </button>
    </label>
  );
}
