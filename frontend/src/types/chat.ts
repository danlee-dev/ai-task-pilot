// src/types/chat.ts
// Shared type definitions for chat functionality

/**
 * Represents a chat message exchanged between user and assistant
 */
export interface Message {
  id?: string;
  role: string; // "user" | "assistant" | "system" | "ai-task"
  content: string;
  timestamp?: Date;
  ai_model?: string; // 어떤 AI 모델이 생성했는지 표시
}
