"use client"

import type React from "react"

import { useAppStore } from "@/lib/store"
import { SidebarNav } from "@/components/sidebar-nav"
import { LoginScreen } from "@/components/login-screen"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { currentUser } = useAppStore()

  if (!currentUser) {
    return <LoginScreen />
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1 pl-64">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}
