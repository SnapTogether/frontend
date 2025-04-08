import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { Delete } from "lucide-react";
import { useTranslations } from "next-intl";
import { deleteGuestMessageByText } from "@/api/guest";
import socket from "@/utils/socket";

export interface Message {
  _id: string;
  text: string;
}

export interface GuestMessagesProps {
  messages: Message[];
  eventCode: string;
  guestId: string;
  onDeleteMessage: (text: string) => void;
}

const GuestMessages: React.FC<GuestMessagesProps> = ({
  messages,
  eventCode,
  guestId,
  onDeleteMessage,
}) => {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [deletingText, setDeletingText] = useState<string | null>(null);
  const t = useTranslations("guestMessages");

  useEffect(() => {
    setLocalMessages(messages); // sync on messages change
  }, [messages]);

  const handleDelete = async (messageText: string) => {
    setDeletingText(messageText);
    const res = await deleteGuestMessageByText(eventCode, guestId, messageText);

    if (res.status === 200) {
      setLocalMessages((prev) => prev.filter((msg) => msg.text !== messageText));
      onDeleteMessage(messageText); // ✅ update parent state too
    } else {
      console.error("❌ Failed to delete message:", res.message);
    }

    setDeletingText(null);
  };

  useEffect(() => {
    const room = `${eventCode}-${guestId}`;
    socket.emit("join", room);

    const handleSocketDelete = ({ text }: { text: string }) => {
      setLocalMessages((prev) => prev.filter((msg) => msg.text !== text));
    };

    socket.on("messageDeleted", handleSocketDelete);

    return () => {
      socket.emit("leave", room);
      socket.off("messageDeleted", handleSocketDelete);
    };
  }, [eventCode, guestId]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center w-full">
      <h2 className="text-white text-xl">{t("messages")}</h2>
      <div className="guest-messages w-full h-full flex flex-col gap-2">
        {localMessages.map((message) => (
          <div
            key={message._id}
            className="message relative bg-gray-800 min-h-[3em] p-1 rounded-full flex items-center text-center justify-center shadow-md"
          >
            <Button
              className="absolute right-1 -translate-y-auto bg-slate-20 !p-3 w-8 h-8 bg-slate-300/20 shadow-md"
              iconRight={<Delete size={18} />}
              onClick={() => handleDelete(message.text)}
              disabled={deletingText === message.text}
            />
            <p className="text-white text-md">{message.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestMessages;
