/*
1. 공통 마크다운 컴포넌트 생성
src/components/markdown/MarkdownRenderer.tsx
 */

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./MarkdownRenderer.module.css"; // 공통 스타일 모듈 생성 필요
import { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  key: string;
}

// 코드 블록 렌더링을 위한 공통 컴포넌트
export const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
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
      <div className={styles.codeShell}>
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
        <div className={styles.codeContent}>
          <SyntaxHighlighter
            style={oneDark}
            language={language}
            PreTag="div"
            {...props}
          >
            {codeText}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  // 인라인 코드
  return (
    <code className={`${className || ""} ${styles.inlineCode}`} {...props}>
      {children}
    </code>
  );
};

// 공통 마크다운 컴포넌트 정의
export const markdownComponents: Components = {
  code: CodeBlock,
  h1: ({ ...props }) => <h1 className={styles.headingOne} {...props} />,
  h2: ({ ...props }) => <h2 className={styles.headingTwo} {...props} />,
  h3: ({ ...props }) => <h3 className={styles.headingThree} {...props} />,
  ul: ({ ...props }) => <ul className={styles.bulletList} {...props} />,
  ol: ({ ...props }) => <ol className={styles.numberedList} {...props} />,
  li: ({ ...props }) => <li className={styles.listItem} {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote className={styles.noteBlock} {...props} />
  ),
};

// 마크다운 렌더러 컴포넌트
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
