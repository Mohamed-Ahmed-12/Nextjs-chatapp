"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button, TextInput } from "flowbite-react";
import { Send } from "lucide-react";
import Message from "./message";
import { useUserData } from "@/src/hooks/useUser";
import { fetchRoomMessage } from "@/src/lib/apis";
import toast from "react-hot-toast";
import ChatListSkelton from "./skelton";

interface ChatWindowProps {
    roomid: string;
}

interface MessageData {
    sender: number;
    text: string;
    sender_username?: string;
    created_at: string; // Use string to match API JSON
}

interface PaginationData {
    next: string | null;
}

export default function ChatWindow({ roomid }: ChatWindowProps) {
    const { username, uid, access } = useUserData();
    const [room, setRoom] = useState<any>({});
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [pagination, setPagination] = useState<PaginationData>({ next: null });
    const chatRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const prevScrollHeightRef = useRef(0);

    /** Scroll helpers */
    const scrollToBottom = useCallback(() => {
        const chat = chatRef.current;
        if (chat) chat.scrollTop = chat.scrollHeight;
    }, []);

    const scrollToPreviousPosition = useCallback(() => {
        const chat = chatRef.current;
        if (!chat || prevScrollHeightRef.current === 0) return;

        const diff = chat.scrollHeight - prevScrollHeightRef.current;
        chat.scrollTop = diff;
        prevScrollHeightRef.current = 0;
    }, []);

    /** Fetch initial messages */
    const loadMessages = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchRoomMessage(roomid);
            setRoom(data?.room || {});
            // Reverse so oldest first in chat window
            setMessages(data?.messages?.reverse() || []);
            setPagination({ next: data?.pagination?.next || null });
            // Scroll to bottom
            setTimeout(scrollToBottom, 50);
        } catch {
            toast.error("Failed to load messages.");
        } finally {
            setIsLoading(false);
        }
    }, [roomid, scrollToBottom]);

    /** Load older messages (scroll top) */
    const loadOlderMessages = async () => {
        if (!pagination.next || isLoadingOlder) return;

        const chat = chatRef.current;
        if (!chat) return;

        prevScrollHeightRef.current = chat.scrollHeight;
        setIsLoadingOlder(true);

        try {
            const url = new URL(pagination.next);
            const cursor = url.searchParams.get("cursor") || null;
            const data = await fetchRoomMessage(roomid, cursor);
            const olderMessages = data?.messages?.reverse() || [];

            setMessages((prev) => [...olderMessages, ...prev]);
            setPagination({ next: data?.pagination?.next || null });
        } catch {
            toast.error("Failed to load older messages.");
        } finally {
            setTimeout(() => {
                setIsLoadingOlder(false);
                scrollToPreviousPosition();
            }, 1000);
        }
    };

    /** Send message via WebSocket */
    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!socketRef.current || !message.trim()) return;

        const payload = {
            message: {
                sender: Number(uid),
                sender_username: username,
                text: message,
                created_at: new Date().toISOString(),
            },
        };
        socketRef.current.send(JSON.stringify(payload));
        setMessage("");
    };

    // --- WebSocket connection function ---
    const openWebSocket = () => {
        if (socketRef.current) return; // already connected
        const wsUrl = `ws://localhost:8000/ws/chat/${roomid}/?token=${access}`;
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => console.log("✅ WebSocket connected");
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const newMsg = data.message;
                setMessages((prev) => [...prev, newMsg]);

                // Auto scroll if near bottom
                const chat = chatRef.current;
                if (chat && chat.scrollHeight - chat.scrollTop < chat.offsetHeight + 100) {
                    chat.scrollTop = chat.scrollHeight;
                }
            } catch (err) {
                console.log("❌ WebSocket parse error:", err);
            }
        };

        socket.onerror = (err) => console.log("⚠️ WebSocket error:", err);
        socket.onclose = () => console.log("❌ WebSocket closed");
    };

    /** Initial messages */
    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    /** Scroll top detection */
    useEffect(() => {
        const chat = chatRef.current;
        if (!chat) return;

        const handleScroll = () => {
            if (chat.scrollTop <= 5 && pagination.next && !isLoadingOlder) {
                loadOlderMessages();
            }
        };

        chat.addEventListener("scroll", handleScroll);
        return () => chat.removeEventListener("scroll", handleScroll);
    }, [pagination.next, isLoadingOlder]);

    /** WebSocket connection */
    useEffect(() => {
        openWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [roomid, access]);


    return (
        <div className="h-dvh flex flex-col">
            {/* Room header */}
            <div className="bg-gray-100 p-4 border-b border-gray-200">
                <h1 className="text-lg font-semibold">{room?.name}</h1>
            </div>

            {/* Messages */}
            {isLoading ? (
                <ChatListSkelton />
            ) : (
                <div
                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-indigo-50"
                    ref={chatRef}
                >
                    {isLoadingOlder && (
                        <div className="text-center mb-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                        </div>
                    )}

                    {messages.length > 0 ? (
                        messages.map((msg, idx) => (
                            <Message
                                key={idx}
                                username={msg.sender_username ?? "Anonymous"}
                                text={msg.text}
                                timestamp={msg.created_at}
                                isOwnMessage={msg.sender === Number(uid)}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-400 mt-10">
                            No messages yet — start chatting!
                        </p>
                    )}
                </div>
            )}

            {/* Input */}
            <form
                onSubmit={sendMessage}
                className="p-3 bg-gray-100 border-t border-gray-200 flex gap-2"
            >
                <TextInput
                    type="text"
                    placeholder="Write your message..."
                    className="w-full"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button color="purple" type="submit">
                    <Send className="me-1" size={16} />
                    Send
                </Button>
            </form>
        </div>
    );
}
