"use client";

import ChatWindow from "@/src/components/chat/chat-window";
import { useParams } from "next/navigation";
import React from "react";

export default function Page() {
  const { roomid } = useParams<{ roomid: string }>();

  return (
    <>
      <ChatWindow roomid={roomid} />
    </>
  );
}
