/**
 * 2. 수정된 TypingEffect 컴포넌트
 * src/components/chat/TypingEffect.tsx
 */

"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./TypingEffect.module.css";
import "katex/dist/katex.min.css";

interface TypingEffectProps {
  content: string;
  typingSpeed?: number;
  initialDelay?: number;
}

interface Token {
  type: "code" | "markdown" | "text" | "math";
  content: string;
}

interface Position {
  start: number;
  end: number;
  text: string;
}

// 수식 패턴을 처리하기 위한 정규식 추가
const INLINE_MATH_REGEX = /\$([^\$\n]+?)\$/g;
const BLOCK_MATH_REGEX = /\$\$([^\$]+?)\$\$/g;

// 추가: 코드 하이라이터 래퍼 컴포넌트
const CodeHighlighter: React.FC<{ language: string; children: string }> = ({
  language,
  children,
  ...props
}) => {
  const [mounted, setMounted] = useState(false);
  // key를 고정값과 타임스탬프 조합으로 구성
  const [key, setKey] = useState(`code-${language}-${Date.now()}`);
  const codeRef = useRef<HTMLDivElement>(null);

  // 마운트 즉시 렌더링
  useEffect(() => {
    if (!mounted) {
      setMounted(true);

      // 첫 번째 강제 리렌더링
      setKey(`code-${language}-${Date.now()}`);

      // 추가 리렌더링으로 안정성 확보
      const timer1 = setTimeout(() => {
        setKey(`code-${language}-${Date.now() + 1}`);

        // 코드 블록 DOM 요소 직접 적용
        if (codeRef.current) {
          const elements = codeRef.current.querySelectorAll("pre, code, div");
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.visibility = "visible";
              el.style.opacity = "1";
              el.style.display = "block";
            }
          });
        }
      }, 10);

      // 백업 리렌더링
      const timer2 = setTimeout(() => {
        setKey(`code-${language}-${Date.now() + 2}`);

        // DOM 직접 조작으로 강제 표시
        if (codeRef.current) {
          const elements = codeRef.current.querySelectorAll("pre, code, div");
          elements.forEach((el) => {
            if (el instanceof HTMLElement) {
              el.style.visibility = "visible";
              el.style.opacity = "1";
              el.style.display = "block";

              // reflow 트리거
              void el.offsetHeight;
            }
          });
        }
      }, 50);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [mounted, language]);

  // 네이티브 DOM 렌더링 플래그 설정
  useEffect(() => {
    // 문서에 렌더링 상태 플래그 설정
    document.documentElement.style.setProperty("--code-rendering", "active");

    return () => {
      document.documentElement.style.removeProperty("--code-rendering");
    };
  }, []);

  return (
    <div ref={codeRef} className={styles.codeContent}>
      <SyntaxHighlighter
        key={key}
        style={oneDark as any}
        language={language}
        PreTag="div"
        wrapLines={true}
        wrapLongLines={true}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

// 추가: 커스텀 마크다운 컴포넌트
const typingMarkdownComponents = {
  code: ({ node, className, children, ...props }: any) => {
    // inline 여부 확인
    const inline = !(className && /language-/.test(className));
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeText = String(children).replace(/\n$/, "");

    // 인라인 코드가 아니고 언어가 지정된 코드 블록
    if (!inline && match) {
      return (
        <div className={`${styles.codeShell} ${styles.codeRendering}`}>
          <div className={styles.codeHeader}>
            <span className={styles.languageLabel}>{language}</span>
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(codeText)}
            >
              복사
            </button>
          </div>
          <CodeHighlighter language={language}>{codeText}</CodeHighlighter>
        </div>
      );
    }

    // 인라인 코드
    return (
      <code
        className={`${inline ? styles.inlineCode : ""} ${className || ""}`}
        {...props}
      >
        {children}
      </code>
    );
  },
  // 리스트 스타일 개선
  ul: ({ ...props }) => (
    <ul
      style={{
        display: "block",
        visibility: "visible",
        opacity: 1,
        marginLeft: 0,
        paddingLeft: "20px",
      }}
      {...props}
    />
  ),
  ol: ({ ...props }) => (
    <ol
      style={{
        display: "block",
        visibility: "visible",
        opacity: 1,
        marginLeft: 0,
        paddingLeft: "20px",
      }}
      {...props}
    />
  ),
  li: ({ ...props }) => (
    <li
      style={{
        display: "list-item",
        visibility: "visible",
        opacity: 1,
        marginLeft: "20px",
        textAlign: "left",
      }}
      {...props}
    />
  ),
};

const TypingEffect: React.FC<TypingEffectProps> = ({
  content,
  typingSpeed = 10,
  initialDelay = 0,
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isRenderingDone, setIsRenderingDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 정규식 패턴 확장
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g;
  const mathBlockRegex = /\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$/g;
  const specialMarkdownRegex =
    /(?:\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|~~.*?~~|\[[^\]]*\]\([^)]*\)|#{1,6}\s.*?$|>\s.*?$|(?:^\d+\.|\*|\-)\s.*?$)/gm;

  /**
   * 수식을 포함한 콘텐츠를 전처리하는 함수
   * 마크다운 파서가 수식 구문을 손상시키지 않도록 보호
   */
  const preprocessContent = (text: string): string => {
    // 수식 보호 처리
    return text
      .replace(BLOCK_MATH_REGEX, (match, formula) => {
        // 언더바는 수식에서 아래첨자로 사용되므로 이스케이프하지 않음
        // 별표와 물결표만 이스케이프
        const escaped = formula.replace(/([*~])/g, "\\$1");
        return `$$${escaped}$$`;
      })
      .replace(INLINE_MATH_REGEX, (match, formula) => {
        // 언더바는 수식에서 아래첨자로 사용되므로 이스케이프하지 않음
        // 별표와 물결표만 이스케이프
        const escaped = formula.replace(/([*~])/g, "\\$1");
        return `$${escaped}$`;
      });
  };

  // 텍스트를 토큰화하는 함수
  const tokenizeText = (text: string): Token[] => {
    // 이전 구현과 동일한 토큰화 로직
    const tokens: Token[] = [];
    let lastIndex = 0;

    // 코드 블록과 수식 블록 추출
    const codeMatches = Array.from(text.matchAll(codeBlockRegex));
    const mathMatches = Array.from(text.matchAll(mathBlockRegex));

    // 코드 및 수식 위치 추적
    const codePositions: Position[] = codeMatches.map((match) => ({
      start: match.index || 0,
      end: (match.index || 0) + match[0].length,
      text: match[0],
    }));

    const mathPositions: Position[] = mathMatches.map((match) => ({
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
          ) &&
          !mathPositions.some(
            (math) =>
              (md.start >= math.start && md.start < math.end) ||
              (md.end > math.start && md.end <= math.end)
          )
      );

    // 모든 위치 정렬
    const allPositions = [
      ...codePositions,
      ...markdownPositions,
      ...mathPositions,
    ].sort((a, b) => a.start - b.start);

    // 토큰화
    for (const pos of allPositions) {
      if (pos.start > lastIndex) {
        tokens.push({
          type: "text",
          content: text.substring(lastIndex, pos.start),
        });
      }

      const isCode = codePositions.some((code) => code.start === pos.start);
      const isMath = mathPositions.some((math) => math.start === pos.start);

      tokens.push({
        type: isCode ? "code" : isMath ? "math" : "markdown",
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
    setIsRenderingDone(false);

    // 수식 처리된 콘텐츠 생성
    const processedContent = preprocessContent(content);
    const tokens = tokenizeText(processedContent);

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

      // 코드 블록, 수식, 마크다운 특수 구문은 한 번에 표시
      if (
        currentToken.type === "code" ||
        currentToken.type === "markdown" ||
        currentToken.type === "math"
      ) {
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

  // 렌더링 강제 트리거를 위한 useEffect 추가
  useEffect(() => {
    if (containerRef.current && isComplete && !isRenderingDone) {
      // 첫번째 렌더링 시도
      const timer1 = setTimeout(() => {
        forceRender();
      }, 10);

      // 두번째 렌더링 시도 (백업)
      const timer2 = setTimeout(() => {
        forceRender();
        setIsRenderingDone(true);
      }, 50);

      // 최종 백업 렌더링
      const timer3 = setTimeout(() => {
        forceRender();
      }, 200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isComplete, isRenderingDone]);

  // 강제 렌더링 함수 추가
  const forceRender = () => {
    if (!containerRef.current) return;

    // 코드 및 수학식 블록 강제 렌더링
    const codeBlocks = containerRef.current.querySelectorAll(
      "pre, code, .react-syntax-highlighter-pre"
    );
    const mathBlocks = containerRef.current.querySelectorAll(".math, .katex");
    // 리스트 항목 강제 렌더링 추가
    const listItems = containerRef.current.querySelectorAll("ul, ol, li");

    // 코드 블록 처리
    codeBlocks.forEach((block) => {
      if (block instanceof HTMLElement) {
        block.style.visibility = "visible";
        block.style.opacity = "1";

        // reflow 트리거
        void block.offsetHeight;
      }
    });

    // 수학식 블록 처리
    mathBlocks.forEach((block) => {
      block.classList.add(styles.mathRendered);

      // reflow 트리거
      if (block instanceof HTMLElement) {
        void block.offsetHeight;
      }
    });

    // 리스트 항목 처리 추가
    listItems.forEach((item) => {
      if (item instanceof HTMLElement) {
        item.style.visibility = "visible";
        item.style.opacity = "1";

        if (item.tagName === "UL" || item.tagName === "OL") {
          item.style.display = "block";
          item.style.paddingLeft = "20px";
          item.style.marginBlockStart = "1em";
          item.style.marginBlockEnd = "1em";
        }

        if (item.tagName === "LI") {
          item.style.display = "list-item";
          item.style.marginLeft = "20px";
          item.style.listStylePosition = "outside";
          item.style.textAlign = "left";
          if (item.parentElement && item.parentElement.tagName === "UL") {
            item.style.listStyleType = "disc";
          } else {
            item.style.listStyleType = "decimal";
          }
        }

        // reflow 트리거
        void item.offsetHeight;
      }
    });
  };

  return (
    <div
      className={`${styles.typingContainer} ${
        isRenderingDone ? styles.rendered : styles.rendering
      }`}
      ref={containerRef}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [
            rehypeKatex,
            {
              throwOnError: false,
              strict: false,
              output: "html",
              trust: true,
              macros: {
                "\\mathbf": "\\boldsymbol",
              },
            },
          ],
        ]}
        components={typingMarkdownComponents}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
};

export default TypingEffect;
