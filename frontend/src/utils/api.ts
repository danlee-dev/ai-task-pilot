// utils/api.ts
export async function sendChat(messages: { role: string; content: string }[]) {
  const response = await fetch("http://localhost:8000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  if (!response.ok) {
    throw new Error("API 호출 실패");
  }

  const data = await response.json();
  return data.message; // { role, content }
}
