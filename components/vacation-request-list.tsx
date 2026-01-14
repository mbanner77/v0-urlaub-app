"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"
import { formatDate } from "@/lib/utils"

export function VacationRequestList() {
  const { currentUser, vacationRequests } = useAppStore()

  if (!currentUser) return null

  const userRequests = vacationRequests
    .filter((r) => r.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            Ausstehend
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            Genehmigt
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-destructive/20 text-destructive">
            Abgelehnt
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meine Urlaubsanträge</CardTitle>
        <CardDescription>Übersicht aller eingereichten Urlaubsanträge</CardDescription>
      </CardHeader>
      <CardContent>
        {userRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">Sie haben noch keine Urlaubsanträge gestellt.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{request.reason}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} Tage)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">{getStatusBadge(request.status)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
