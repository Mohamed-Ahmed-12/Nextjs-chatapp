import React from "react"
import { AuthProvider } from "@/src/lib/context/auth"
import "./globals.css"
import { Toaster } from "react-hot-toast"


export const metadata = {
  title: "ChatHub - Mini Chat System",
  description: "A clean and minimal chat system dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased h-dvh`}>
        <AuthProvider>
          {children}
          <Toaster position="bottom-right"/>
        </AuthProvider>
      </body>
    </html>
  )
}
