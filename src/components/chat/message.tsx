import React from "react";
import { Avatar, Tooltip } from "flowbite-react";
import { formatChatDate } from "@/src/lib/helpers";

interface MessageProps {
  username: string;
  text: string;
  timestamp: string;
  isOwnMessage?: boolean;
}

export default function Message({
  username,
  text,
  timestamp,
  isOwnMessage = false,
}: MessageProps) {
  return (
    <div
      className={`flex items-end mb-3 ${isOwnMessage ? "justify-end" : "justify-start"
        }`}
    >
      {/* Avatar */}
      {!isOwnMessage && (
        <Avatar
          rounded
          img={`https://ui-avatars.com/api/?name=${username}&background=random`}
          alt={username}
          className="mr-2"
        />
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[70%] p-3 rounded-2xl shadow-md text-sm ${isOwnMessage
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
          }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold mb-1 text-gray-500">
            {username}
          </p>
        )}
        <p className="whitespace-pre-wrap">{text}</p>

        <div
          className={`text-[10px] mt-1 text-gray-400 ${isOwnMessage ? "text-right" : "text-left"}`}
        >
          {formatChatDate(timestamp)}
        </div>
      </div>

      {/* Avatar for own message (optional) */}
      {isOwnMessage && (
        <Avatar
          rounded
          alt={username}
          className="ml-2"
        />
      )}
    </div>
  );
}
