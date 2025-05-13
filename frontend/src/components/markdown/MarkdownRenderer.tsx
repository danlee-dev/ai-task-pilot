/*
1. 공통 마크다운 컴포넌트 생성
src/components/markdown/MarkdownRenderer.tsx
 */

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./MarkdownRenderer.module.css";
import { Components } from "react-markdown";
import "katex/dist/katex.min.css";

// 타입 선언 추가
declare module "react-markdown" {
  interface ReactMarkdownProps {
    remarkPlugins?: any[];
    rehypePlugins?: any[];
  }
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 수식 패턴을 처리하기 위한 정규식
const INLINE_MATH_REGEX = /\$([^\$\n]+?)\$/g;
const BLOCK_MATH_REGEX = /\$\$([^\$]+?)\$\$/g;

/**
 * 수식을 포함한 콘텐츠를 전처리하는 함수
 * 마크다운 파서가 수식 구문을 손상시키지 않도록 보호
 */
const preprocessContent = (content: string): string => {
  // 블록 수식을 처리
  return content
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

// 코드 하이라이터 래퍼 컴포넌트 추가
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

// 마크다운 렌더러 컴포넌트
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  // 렌더링 완료 상태 추가
  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 수식을 포함한 콘텐츠 전처리
  const processedContent = preprocessContent(content);

  // 별도의 useLayoutEffect로 렌더링 직후에 실행
  useLayoutEffect(() => {
    if (containerRef.current) {
      // 컨텐츠가 변경되면 렌더링 상태 초기화
      setIsRendered(false);
    }
  }, [content]);

  // 렌더링 후 강제 업데이트를 위한 useEffect
  useEffect(() => {
    if (containerRef.current && !isRendered) {
      // 첫번째 렌더링 시도
      const timer1 = setTimeout(() => {
        forceRender();
      }, 10);

      // 두번째 렌더링 시도 (백업)
      const timer2 = setTimeout(() => {
        forceRender();
        setIsRendered(true);
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
  }, [content, isRendered]);

  // 강제 렌더링 함수
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
      (block as HTMLElement).style.visibility = "visible";
      (block as HTMLElement).style.opacity = "1";

      // reflow 트리거
      void (block as HTMLElement).offsetHeight;
    });

    // 수학식 블록 처리
    mathBlocks.forEach((block) => {
      block.classList.add(styles.mathRendered);

      // reflow 트리거
      void (block as HTMLElement).offsetHeight;
    });

    // 리스트 항목 처리
    listItems.forEach((item) => {
      (item as HTMLElement).style.visibility = "visible";
      (item as HTMLElement).style.opacity = "1";

      if (item.tagName === "UL" || item.tagName === "OL") {
        (item as HTMLElement).style.display = "block";
        (item as HTMLElement).style.paddingLeft = "20px";
        (item as HTMLElement).style.marginBlockStart = "1em";
        (item as HTMLElement).style.marginBlockEnd = "1em";
      }

      if (item.tagName === "LI") {
        (item as HTMLElement).style.display = "list-item";
        (item as HTMLElement).style.marginLeft = "20px";
        (item as HTMLElement).style.listStylePosition = "outside";
        (item as HTMLElement).style.textAlign = "left";
        if ((item.parentElement as HTMLElement).tagName === "UL") {
          (item as HTMLElement).style.listStyleType = "disc";
        } else {
          (item as HTMLElement).style.listStyleType = "decimal";
        }
      }

      // reflow 트리거
      void (item as HTMLElement).offsetHeight;
    });
  };

  // 공통 마크다운 컴포넌트 정의
  const markdownComponents: Components = {
    code: ({ node, className, children, ...props }: any) => {
      // inline 여부 확인
      const inline = !(className && /language-/.test(className));
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";
      const codeText = String(children).replace(/\n$/, "");

      // 복사 기능
      const handleCopy = () => {
        navigator.clipboard.writeText(codeText);
      };

      // 인라인 코드가 아니고 언어가 지정된 코드 블록
      if (!inline && match) {
        return (
          <div className={`${styles.codeShell} ${styles.codeRendering}`}>
            <div className={styles.codeHeader}>
              <span className={styles.languageLabel}>{language}</span>
              <button
                className={styles.copyButton}
                onClick={handleCopy}
                aria-label="코드 복사"
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
    // 기존 스타일링 적용 및 개선
    h1: ({ ...props }) => <h1 className={styles.headingOne} {...props} />,
    h2: ({ ...props }) => <h2 className={styles.headingTwo} {...props} />,
    h3: ({ ...props }) => <h3 className={styles.headingThree} {...props} />,
    ul: ({ ...props }) => (
      <ul
        className={styles.bulletList}
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
        className={styles.numberedList}
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
        className={styles.listItem}
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
    blockquote: ({ ...props }) => (
      <blockquote className={styles.noteBlock} {...props} />
    ),
  };

  return (
    <div
      className={`${styles.markdownContainer} ${className || ""} ${
        isRendered ? styles.rendered : styles.rendering
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
              trust: true, // 추가: 모든 명령어 허용
              macros: {
                // 자주 사용하는 매크로 정의
                "\\mathbf": "\\boldsymbol",
              },
            },
          ],
        ]}
        components={markdownComponents}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
