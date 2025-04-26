// File: src/components/chat-history-context.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ChatHistoryItem = {
  id: string;
  title: string;
  createdAt: Date;
  preview: string;
};

type ChatHistoryContextType = {
  chats: ChatHistoryItem[];
  addChat: (chat: Omit<ChatHistoryItem, "id" | "createdAt">) => void;
  deleteChat: (id: string) => void;
};

const ChatHistoryContext = createContext<ChatHistoryContextType>({
  chats: [],
  addChat: () => {},
  deleteChat: () => {},
});

export const useChatHistory = () => useContext(ChatHistoryContext);

export const ChatHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<ChatHistoryItem[]>(() => {
    // Initialize with some mock data
    return [
      {
        id: "1",
        title: "About AI License",
        preview: "Can you explain the AI License program?",
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Tramway prices",
        preview: "What are the current tramway prices in Casablanca?",
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
    ];
  });

  const addChat = (chat: Omit<ChatHistoryItem, "id" | "createdAt">) => {
    setChats((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        ...chat,
      },
      ...prev,
    ]);
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  return (
    <ChatHistoryContext.Provider value={{ chats, addChat, deleteChat }}>
      {children}
    </ChatHistoryContext.Provider>
  );
};