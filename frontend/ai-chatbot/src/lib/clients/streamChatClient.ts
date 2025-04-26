import { Message } from "@/lib/types";
import { generateUUID } from "@/lib/utils";

interface StreamChatParams {
  inputContent: string;
  setIsLoading: (loading: boolean) => void;
  append: (message: Message) => Promise<string | null | undefined>;
}

export const streamChat = async ({
  inputContent,
  setIsLoading,
  append,
}: StreamChatParams) => {
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:8000/api/chat-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: inputContent
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Request failed");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    let messageId = generateUUID();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      await append({
        id: messageId,
        content: chunk,
        role: "assistant",
      });
    }
  } catch (error) {
    console.error("Streaming error:", error);
    await append({
      id: generateUUID(),
      content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      role: "assistant",
    });
  } finally {
    setIsLoading(false);
  }
};