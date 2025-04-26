// File: src/components/history-sidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen, Plus, Trash2 } from "lucide-react";
import { useChatHistory } from "./chat-history-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";

export const HistorySidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { chats, deleteChat } = useChatHistory();
  const pathname = usePathname();
  const currentChatId = pathname.split("/")[2]; // Extract chat ID from URL

  // Group chats by date
  const groupedChats = chats.reduce((acc, chat) => {
    const date = format(chat.createdAt, "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(chat);
    return acc;
  }, {} as Record<string, typeof chats>);

  return (
    <aside
      className={`h-screen bg-background border-r transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-14" : "w-64"
      }`}
    >
      <div className="p-2 border-b flex justify-between items-center">
        {!isCollapsed && <h2 className="font-semibold">Licence d'Excellence Ai</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="shrink-0"
        >
          {isCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="space-y-4 p-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Plus size={16} className="mr-2" />
                Nouveau chat
              </Link>
            </Button>

            {Object.entries(groupedChats).map(([date, dateChats]) => (
              <div key={date}>
                <div className="text-xs text-muted-foreground p-2">
                  {format(new Date(date), "MMMM d, yyyy")}
                </div>
                {dateChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center rounded-md hover:bg-accent ${
                      currentChatId === chat.id ? "bg-accent" : ""
                    }`}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start flex-1"
                    >
                      <Link
                        href={`/chat/${chat.id}`}
                        className="truncate text-left"
                      >
                        <span className="truncate">{chat.title}</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 h-8 w-8"
                      onClick={() => deleteChat(chat.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};