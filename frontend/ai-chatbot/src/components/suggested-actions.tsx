"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { memo } from "react";
import { Message } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { Overview } from "./overview";

interface SuggestedActionsProps {
  chatId: string;
  appendAndTrigger: (message: Message) => Promise<void>;
}

function PureSuggestedActions({ chatId, appendAndTrigger }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Qu'est-ce que",
      label: "la Licence d'Excellence en IA ?",
      action: "Peux-tu expliquer ce qu'est la Licence d'Excellence en Intelligence Artificielle ?",
    },
    {
      title: "C'est quoi",
      label: `l'intelligence artificielle ?`,
      o: `Peux-tu me donner une définition claire de l'intelligence artificielle ?`,
    },
    {
      title: "Quels sont les",
      label: `tarifs du tramway à Casablanca ?`,
      action: `Peux-tu me donner les tarifs actuels du tramway à Casablanca ?`,
    },
    {
      title: "Comment puis-je",
      label: "m'inscrire à la Licence d'Excellence en IA ?",
      action: "Quelles sont les démarches pour s'inscrire à la Licence d'Excellence en IA ?",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-3xl mx-auto p-4">
      {/* Overview Section */}
      <Overview />
      <div className="grid sm:grid-cols-2 gap-2 w-full">
        {suggestedActions.map((suggestedAction, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * index }}
            key={`suggested-action-${suggestedAction.title}-${index}`}
            className={index > 1 ? "hidden sm:block" : "block"}
          >
            <Button
              variant="ghost"
              onClick={async () => {
                window.history.replaceState({}, "", `/chat/${chatId}`);

                appendAndTrigger({
                  id: generateUUID(),
                  role: "user",
                  content: suggestedAction.action,
                });
              }}
              className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
            >
              <span className="font-medium">{suggestedAction.title}</span>
              <span className="text-muted-foreground">
                {suggestedAction.label}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
