// src/types/chat.ts
// Shared type definitions for chat functionality

/**
 * Represents a chat message exchanged between user and assistant
 */
export interface Message {
  role: string; // "user" | "assistant" | "system"
  content: string;
}
