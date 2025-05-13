/**
 * 2. 수정된 TypingEffect 컴포넌트
 * src/components/chat/TypingEffect.tsx
 */

"use client";
import React, { useState, useEffect } from "react";
import { markdownComponents } from "../markdown/MarkdownRenderer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./TypingEffect.module.css";

interface TypingEffectProps {
  content: string;
  typingSpeed?: number;
  initialDelay?: number;
}

interface Token {
  type: "code" | "markdown" | "text";
  content: string;
}

interface Position {
  start: number;
  end: number;
  text: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  content,
  typingSpeed = 10,
  initialDelay = 0,
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>("");
  const [, setIsComplete] = useState<boolean>(false);
  const [, setIsTyping] = useState<boolean>(false);

  // 정규식 패턴
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g;
  const specialMarkdownRegex =
    /(?:\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|~~.*?~~|\[[^\]]*\]\([^)]*\)|#{1,6}\s.*?$|>\s.*?$|(?:^\d+\.|\*|\-)\s.*?$)/gm;

  // 텍스트를 토큰화하는 함수
  const tokenizeText = (text: string): Token[] => {
    // 이전 구현과 동일한 토큰화 로직
    const tokens: Token[] = [];
    let lastIndex = 0;

    // 코드 블록 추출
    const codeMatches = Array.from(text.matchAll(codeBlockRegex));
    const codePositions: Position[] = codeMatches.map((match) => ({
      start: match.index || 0,
      end: (match.index || 0) + match[0].length,
      text: match[0],
    }));

    // 특수 마크다운 요소 추출
    const markdownMatches = Array.from(text.matchAll(specialMarkdownRegex));
    const markdownPositions: Position[] = markdownMatches
      .map((match) => ({
        start: match.index || 0,
        end: (match.index || 0) + match[0].length,
        text: match[0],
      }))
      .filter(
        (md) =>
          !codePositions.some(
            (code) =>
              (md.start >= code.start && md.start < code.end) ||
              (md.end > code.start && md.end <= code.end)
          )
      );

    // 모든 위치 정렬
    const allPositions = [...codePositions, ...markdownPositions].sort(
      (a, b) => a.start - b.start
    );

    // 토큰화
    for (const pos of allPositions) {
      if (pos.start > lastIndex) {
        tokens.push({
          type: "text",
          content: text.substring(lastIndex, pos.start),
        });
      }

      const isCode = codePositions.some((code) => code.start === pos.start);
      tokens.push({
        type: isCode ? "code" : "markdown",
        content: pos.text,
      });

      lastIndex = pos.end;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return tokens;
  };

  useEffect(() => {
    if (!content) return;

    setDisplayedContent("");
    setIsComplete(false);
    setIsTyping(true);

    const tokens = tokenizeText(content);
    let currentDisplayedContent = "";
    let tokenIndex = 0;
    let charIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (tokenIndex >= tokens.length) {
        setIsComplete(true);
        setIsTyping(false);
        return;
      }

      const currentToken = tokens[tokenIndex];

      if (currentToken.type === "code" || currentToken.type === "markdown") {
        currentDisplayedContent += currentToken.content;
        setDisplayedContent(currentDisplayedContent);
        tokenIndex++;
        charIndex = 0;
        typingTimer = setTimeout(typeNextChar, typingSpeed * 2);
        return;
      }

      if (charIndex < currentToken.content.length) {
        currentDisplayedContent += currentToken.content[charIndex];
        setDisplayedContent(currentDisplayedContent);
        charIndex++;

        const pauseChars = [".", "!", "?", ",", ";", ":", "\n"];
        const delay = pauseChars.includes(currentToken.content[charIndex - 1])
          ? typingSpeed * 5
          : typingSpeed;

        typingTimer = setTimeout(typeNextChar, delay);
      } else {
        tokenIndex++;
        charIndex = 0;
        typingTimer = setTimeout(typeNextChar, typingSpeed);
      }
    };

    const startTimer = setTimeout(() => {
      typeNextChar();
    }, initialDelay);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(typingTimer);
      setIsTyping(false);
    };
  }, [content, typingSpeed, initialDelay]);

  return (
    <div className={styles.typingContainer}>
      {/* 공통 마크다운 컴포넌트를 바로 사용하지 않고 ReactMarkdown을 직접 사용
         (토큰화된 내용을 단계적으로 표시해야 하기 때문) */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default TypingEffect;
