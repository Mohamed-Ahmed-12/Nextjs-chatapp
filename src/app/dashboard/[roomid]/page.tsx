<<<<<<< HEAD
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
=======
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
>>>>>>> 3a0b02aec8f4c5b7d47461bef88064dee3062d09
