import React, { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService, Message } from "../../services/messageService";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const MessageList: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    data: messages,
    isLoading,
    error,
  } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => messageService.findAll(),
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("newClickFromServer", () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    });

    socket.on("messageLiked", () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const handleLike = (messageId: string) => {
    const socket = io("http://localhost:8000");
    socket.emit("likeMessage", messageId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return <div className="text-center">Loading messages...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading messages. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages?.map((message) => (
        <div key={message.id} className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-gray-800">{message.text}</p>
          <div className="flex justify-between items-center text-sm text-gray-500/60 mt-4">
            <p>{message?.user?.email}</p>
            <p>
              {formatDistanceToNow(new Date(message.createdAt), {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
          <div className="mt-2 flex justify-between items-center text-sm">
            <button
              onClick={() => handleLike(message.id)}
              className="text-blue-600 hover:underline"
            >
              👍 Like
            </button>
            <span>
              {message.likes ?? 0} like{message.likes !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
