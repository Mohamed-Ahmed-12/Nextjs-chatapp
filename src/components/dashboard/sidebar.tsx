"use client";

import { useUserData } from "@/src/hooks/useUser";
import { fetchUserRooms } from "@/src/lib/apis";
import { useAuth } from "@/src/lib/context/auth";
import { formatChatDate } from "@/src/lib/helpers";
import { Avatar, Badge, Button, FloatingLabel, Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { LogOut, Plus, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from 'react'

export function SideBarComp() {
    const pathname = usePathname();
    const [rooms, setRooms] = useState<[] | null>(null);
    const [isLoading, setLoading] = useState(false);
    const { username, uid } = useUserData();
    const {logout} = useAuth();
    useEffect(() => {
        if (!uid) return;
        setLoading(true)
        fetchUserRooms(uid)
            .then((data) => {
                setRooms(data);
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)

            })
    }, [uid])
    return (
        <Sidebar className="w-full">
            <SidebarItems className="mx-1 flex flex-col justify-between h-full">
                <div>
                    <SidebarItemGroup>
                        <li className="flex justify-between items-baseline">
                            <span className="text-md">Chats ({rooms?.length})</span>
                            <Button color="alternative" size="xs" >
                                <Plus size="14" /> New Chat
                            </Button>
                        </li>
                        <li>
                            <FloatingLabel variant="outlined" label="Search" sizing="sm" className="bg-white" />
                        </li>

                    </SidebarItemGroup>

                    <SidebarItemGroup>
                        {rooms && rooms.length > 0 ? (
                            rooms.map((room: any) => {
                                const isActive = pathname === `/dashboard/${room.id}`;

                                return (
                                    <li key={room.id}>
                                        <Link
                                            href={`/dashboard/${room.id}`}
                                            className={`flex justify-between  rounded-lg transition p-2 ${isActive ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-white" : "hover:bg-purple-50 dark:hover:bg-gray-800"}`}
                                        >
                                            <div className="flex gap-3">
                                                <Avatar rounded />
                                                <div className="space-y-1 font-medium dark:text-white">
                                                    <div className="text-blue-600">{room?.name?.slice(0, 18) ?? "Chat"}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span>
                                                            {room.last_message ? (
                                                                <>
                                                                    {room.last_message.sender == uid
                                                                        ? "You:"
                                                                        : `${room.last_message.sender_username}:`}{" "}
                                                                    {room.last_message.text.slice(0, 10)}
                                                                </>
                                                            ) : (
                                                                "Chat Now"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                <span>
                                                    {room.last_message
                                                        ? formatChatDate(room.last_message.created_at)
                                                        : ""}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center">No rooms available</p>
                        )}
                    </SidebarItemGroup>

                </div>

                <div>
                    <li className="flex justify-between text-indigo-800 text-sm">
                        <Link href={"/dashboard/profile"} className="flex gap-2 justify-center">
                            <UserRound /> {username}
                        </Link>
                        <button className="flex gap-2 justify-center cursor-pointer" onClick={logout}>
                            <LogOut /> Logout
                        </button>
                    </li>
                </div>


            </SidebarItems>
        </Sidebar>
    );
}

