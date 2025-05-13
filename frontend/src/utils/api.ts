interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  message: {
    role: string;
    content: string;
  };
  ai_model: string;
}

export async function sendChat(
  messages: ChatMessage[],
  aiModel: string = "gpt"
): Promise<ChatResponse> {
  const response = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      ai_model: aiModel,
    }),
  });

  if (!response.ok) {
    throw new Error("API 호출 실패");
  }

  return await response.json();
}

export async function switchAIAndContinue(
  messages: ChatMessage[],
  currentAiModel: string
): Promise<ChatResponse> { // 아직 값은 없지만 언젠가는 값을 줄거라는 것을 알려주는 것
  const response = await fetch("http://localhost:8000/api/chat/switch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      ai_model: currentAiModel,
    }),
  });

  if (!response.ok) {
    throw new Error("AI 전환 실패");
  }

  return await response.json();
}
