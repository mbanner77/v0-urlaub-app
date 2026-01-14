"use client"

import { useAppStore } from "@/lib/store"
import { LoginScreen } from "@/components/login-screen"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { currentUser } = useAppStore()

  useEffect(() => {
    if (currentUser) {
      redirect("/dashboard")
    }
  }, [currentUser])

  return <LoginScreen />
}
