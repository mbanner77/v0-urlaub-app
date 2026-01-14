"use client"

import { useAppStore } from "@/lib/store"
import { VacationStats } from "@/components/vacation-stats"
import { VacationRequestList } from "@/components/vacation-request-list"
import { VacationCalendar } from "@/components/vacation-calendar"

export default function DashboardPage() {
  const { currentUser } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Willkommen, {currentUser?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Übersicht Ihrer Urlaubstage und Anträge</p>
      </div>

      <VacationStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <VacationRequestList />
        <VacationCalendar />
      </div>
    </div>
  )
}
