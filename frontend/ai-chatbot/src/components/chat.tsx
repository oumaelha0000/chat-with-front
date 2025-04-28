"use client";

import { ChatInput } from "@/components/chat-input";
import { Message } from "@/lib/types";
import { fillMessageParts, generateUUID } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import ChatMessage from "./chat-message";
import { streamChat } from "@/lib/clients/streamChatClient";
import { useChatHistory } from "@/components/chat-history-context";
import { usePathname, useRouter } from "next/navigation";

export function Chat({ id }: { id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { addChat } = useChatHistory();
  
  
  const addedToHistoryRef = useRef(false);

  
  const initialInput = "";
  const [inputContent, setInputContent] = useState<string>(initialInput);
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const { data: messages, mutate } = useSWR<Message[]>([id, "messages"], null, {
    fallbackData: [],
  });


  const messagesRef = useRef<Message[]>(messages || []);
  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);

  const setMessages = useCallback(
    (messages: Message[] | ((messages: Message[]) => Message[])) => {
      if (typeof messages === "function") {
        messages = messages(messagesRef.current);
      }

      const messagesWithParts = fillMessageParts(messages);
      mutate(messagesWithParts, false);
      messagesRef.current = messagesWithParts;
    },
    [mutate]
  );

  
  const append = useCallback(
    async (message: Message) => {
      return new Promise<string | null | undefined>((resolve) => {
        setMessages((draft) => {
          const lastMessage = draft[draft.length - 1];

          if (
            lastMessage?.role === "assistant" &&
            message.role === "assistant"
          ) {
            
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + message.content,
            };

            resolve(updatedMessage.content);
            return [...draft.slice(0, -1), updatedMessage];
          } else {
            // Add a new message
            resolve(message.content);
            return [...draft, message];
          }
        });
      });
    },
    [setMessages]
  );

 
  const appendAndTrigger = useCallback(
    async (message: Message) => {
      const inputContent: string = message.content;
      
  
      if (messagesRef.current.length === 0) {
        addedToHistoryRef.current = true;
        addChat({
          title: inputContent.substring(0, 30) + (inputContent.length > 30 ? "..." : ""),
          preview: inputContent.substring(0, 100),
        });
      }
      
      await append(message);
      return await streamChat({ inputContent, setIsLoading, append });
    },
    [setIsLoading, append, addChat]
  );

 
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputContent(e.target.value);
  };

  const handleSubmit = useCallback(
    async (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();

      if (!inputContent.trim()) return;

      const newMessage: Message = {
        id: generateUUID(),
        content: inputContent,
        role: "user",
      };
      
      await append(newMessage);
      setInputContent("");
      await streamChat({ inputContent, setIsLoading, append });
    },
    [inputContent, setInputContent, setIsLoading, append]
  );

  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl pt-14 pb-60 mx-auto stretch">
      <ChatMessage isLoading={isLoading} messages={messages} />

      <ChatInput
        chatId={id}
        userInput={inputContent}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        messages={messages}
        appendAndTrigger={appendAndTrigger}
      />
    </div>
  );
}
