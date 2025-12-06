import React from "react"
import { AuthProvider } from "@/src/lib/context/auth"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import {Quicksand} from "next/font/google"

export const metadata = {
  title: "ChatHub - Mini Chat System",
  description: "A clean and minimal chat system dashboard",
  generator: "v0.app",
}
const QuicksandFont = Quicksand({
  subsets:['latin'],
  weight:['300','400','500']
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${QuicksandFont.className} h-dvh`}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right"/>
        </AuthProvider>
      </body>
    </html>
  )
}
