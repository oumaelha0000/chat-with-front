import { Chat } from "@/components/chat";
import { generateUUID } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function Home({
  params
}: {
  params: { id?: string[] }
}) {
  const chatId = params.id?.[0] || generateUUID();
  return <Chat id={chatId} />;
}