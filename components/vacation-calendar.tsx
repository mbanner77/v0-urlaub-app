"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function VacationCalendar() {
  const { currentUser, vacationRequests } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  if (!currentUser) return null

  const userRequests = vacationRequests.filter((r) => r.userId === currentUser.id && r.status === "approved")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

  const daysInMonth = lastDayOfMonth.getDate()
  const days = []

  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isVacationDay = (day: number | null) => {
    if (!day) return false
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return userRequests.some((r) => {
      const start = new Date(r.startDate)
      const end = new Date(r.endDate)
      const current = new Date(dateStr)
      return current >= start && current <= end
    })
  }

  const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ]

  const dayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Urlaubskalender</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[120px] text-center text-sm font-medium">
            {monthNames[month]} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "flex h-10 items-center justify-center rounded-md text-sm",
                day === null && "text-transparent",
                day !== null && isVacationDay(day)
                  ? "bg-accent text-accent-foreground font-medium"
                  : day !== null && "hover:bg-secondary",
              )}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded bg-accent" />
          <span>Genehmigter Urlaub</span>
        </div>
      </CardContent>
    </Card>
  )
}
