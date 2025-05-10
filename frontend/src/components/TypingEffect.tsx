"use client";
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './TypingEffect.module.css';

interface TypingEffectProps {
  content: string;
  typingSpeed?: number; // 타이핑 속도 (ms)
  initialDelay?: number; // 시작 전 지연 시간 (ms)
}

// 더 효율적인 타이핑 이펙트 구현
const TypingEffect: React.FC<TypingEffectProps> = ({
  content,
  typingSpeed = 10,
  initialDelay = 0,
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // 코드 블록을 더 정확하게 감지하기 위한 정규식
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+`/g;

  // 특수 마크다운 요소를 감지하기 위한 정규식
  const specialMarkdownRegex = /(?:\*\*.*?\*\*|\*.*?\*|__.*?__|_.*?_|~~.*?~~|\[[^\]]*\]\([^)]*\)|#{1,6}\s.*?$|>\s.*?$|(?:^\d+\.|\*|\-)\s.*?$)/gm;

  useEffect(() => {
    if (!content) return;

    setDisplayedContent('');
    setIsComplete(false);
    setIsTyping(true);

    // 지연 타이머를 위한 참조
    let typingTimer: NodeJS.Timeout;

    // 텍스트를 토큰화: 코드 블록, 특수 마크다운, 일반 텍스트로 구분
    const tokenizeText = () => {
      const tokens: { type: 'code' | 'markdown' | 'text', content: string }[] = [];
      let lastIndex = 0;

      // 코드 블록 먼저 추출 (우선순위 높음)
      const codeMatches = [...content.matchAll(codeBlockRegex)];
      const codePositions = codeMatches.map(match => ({
        start: match.index!,
        end: match.index! + match[0].length,
        text: match[0]
      }));

      // 특수 마크다운 요소 추출
      const markdownMatches = [...content.matchAll(specialMarkdownRegex)];
      const markdownPositions = markdownMatches
        .map(match => ({
          start: match.index!,
          end: match.index! + match[0].length,
          text: match[0]
        }))
        // 코드 블록과 겹치는 마크다운 요소는 제외
        .filter(md => !codePositions.some(code =>
          (md.start >= code.start && md.start < code.end) ||
          (md.end > code.start && md.end <= code.end)
        ));

      // 모든 위치를 시작 위치 기준으로 정렬
      const allPositions = [...codePositions, ...markdownPositions].sort((a, b) => a.start - b.start);

      // 토큰화
      for (const pos of allPositions) {
        // 이전 위치부터 현재 특수 요소 시작까지의 일반 텍스트
        if (pos.start > lastIndex) {
          tokens.push({
            type: 'text',
            content: content.substring(lastIndex, pos.start)
          });
        }

        // 특수 요소 추가
        tokens.push({
          type: codePositions.some(code => code.start === pos.start) ? 'code' : 'markdown',
          content: pos.text
        });

        lastIndex = pos.end;
      }

      // 마지막 특수 요소 이후의 텍스트
      if (lastIndex < content.length) {
        tokens.push({
          type: 'text',
          content: content.substring(lastIndex)
        });
      }

      return tokens;
    };

    const tokens = tokenizeText();
    let currentDisplayedContent = '';
    let tokenIndex = 0;
    let charIndex = 0;

    const typeNextChar = () => {
      if (tokenIndex >= tokens.length) {
        setIsComplete(true);
        setIsTyping(false);
        return;
      }

      const currentToken = tokens[tokenIndex];

      // 코드 블록과 마크다운 요소는 한 번에 추가
      if (currentToken.type === 'code' || currentToken.type === 'markdown') {
        currentDisplayedContent += currentToken.content;
        setDisplayedContent(currentDisplayedContent);
        tokenIndex++;
        charIndex = 0;
        typingTimer = setTimeout(typeNextChar, typingSpeed * 2); // 약간 더 지연
        return;
      }

      // 일반 텍스트는 한 글자씩 추가
      if (charIndex < currentToken.content.length) {
        currentDisplayedContent += currentToken.content[charIndex];
        setDisplayedContent(currentDisplayedContent);
        charIndex++;

        // 문장 부호에서 약간 더 지연
        const pauseChars = ['.', '!', '?', ',', ';', ':', '\n'];
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

    // 시작 지연 후 타이핑 시작
    const startTimer = setTimeout(() => {
      typeNextChar();
    }, initialDelay);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(startTimer);
      clearTimeout(typingTimer);
      setIsTyping(false);
    };
  }, [content, typingSpeed, initialDelay]);

  // 코드 블록 렌더링을 위한 컴포넌트
  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeText = String(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div className={styles.codeShell}>
          <div className={styles.codeHeader}>
            <span className={styles.languageLabel}>{language}</span>
            <button
              className={styles.copyButton}
              onClick={() => navigator.clipboard.writeText(codeText)}
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

    return (
      <code className={`${className} ${styles.inlineCode}`} {...props}>
        {children}
      </code>
    );
  };

  return (
    <div className={styles.typingContainer}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: CodeBlock,
          h1: ({ node, ...props }) => (
            <h1 className={styles.headingOne} {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className={styles.headingTwo} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className={styles.headingThree} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className={styles.bulletList} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className={styles.numberedList} {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className={styles.listItem} {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className={styles.noteBlock} {...props} />
          ),
        }}
      >
        {displayedContent}
      </ReactMarkdown>
      {isTyping && <span className={styles.cursor}></span>}
    </div>
  );
};

export default TypingEffect;
