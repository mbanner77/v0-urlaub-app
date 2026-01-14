"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react"

export function VacationStats() {
  const { currentUser, vacationRequests } = useAppStore()

  if (!currentUser) return null

  const userRequests = vacationRequests.filter((r) => r.userId === currentUser.id)
  const pendingRequests = userRequests.filter((r) => r.status === "pending")
  const approvedRequests = userRequests.filter((r) => r.status === "approved")
  const rejectedRequests = userRequests.filter((r) => r.status === "rejected")

  const remainingDays = currentUser.totalVacationDays - currentUser.usedVacationDays
  const usagePercentage = (currentUser.usedVacationDays / currentUser.totalVacationDays) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Verfügbare Tage</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{remainingDays}</div>
          <div className="mt-2">
            <Progress value={100 - usagePercentage} className="h-2" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {currentUser.usedVacationDays} von {currentUser.totalVacationDays} Tagen genutzt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Ausstehende Anträge</CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingRequests.length}</div>
          <p className="mt-2 text-xs text-muted-foreground">Warten auf Genehmigung</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Genehmigt</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedRequests.length}</div>
          <p className="mt-2 text-xs text-muted-foreground">Genehmigte Anträge</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Abgelehnt</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedRequests.length}</div>
          <p className="mt-2 text-xs text-muted-foreground">Abgelehnte Anträge</p>
        </CardContent>
      </Card>
    </div>
  )
}
