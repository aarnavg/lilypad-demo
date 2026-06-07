import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ConversationMessage } from "../agent/types";

export function Conversation({
  messages,
  thinking,
}: {
  messages: ConversationMessage[];
  thinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      <div className="space-y-3">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              message.role === "user"
                ? "ml-9 rounded-2xl rounded-br-md bg-[#254f3d] px-3.5 py-2.5 text-[12px] leading-5 text-white"
                : message.role === "system"
                  ? "rounded-lg border border-[#e1c4ba] bg-[#fff2ed] px-3 py-2 text-[11px] leading-4 text-[#8c4437]"
                  : "mr-6 rounded-2xl rounded-bl-md border border-[#e1dbce] bg-white px-3.5 py-2.5 text-[12px] leading-5 text-[#334039] shadow-sm"
            }
          >
            {message.text}
          </motion.div>
        ))}
        {thinking && (
          <div className="mr-24 flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-[#e1dbce] bg-white px-3.5 py-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 animate-bounce rounded-full bg-[#829086]"
                style={{ animationDelay: `${dot * 120}ms` }}
              />
            ))}
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
