"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { calculateBusinessDays } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarDays, AlertCircle, CheckCircle2 } from "lucide-react"

export default function NewVacationPage() {
  const router = useRouter()
  const { currentUser, addVacationRequest } = useAppStore()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!currentUser) return null

  const remainingDays = currentUser.totalVacationDays - currentUser.usedVacationDays

  const calculatedDays = startDate && endDate ? calculateBusinessDays(startDate, endDate) : 0

  const isValid = startDate && endDate && reason && calculatedDays > 0 && calculatedDays <= remainingDays

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    addVacationRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      startDate,
      endDate,
      days: calculatedDays,
      reason,
      status: "pending",
    })

    setSubmitted(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Antrag eingereicht</h2>
            <p className="mt-2 text-center text-muted-foreground">
              Ihr Urlaubsantrag wurde erfolgreich eingereicht und wartet auf Genehmigung.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Urlaub beantragen</h1>
        <p className="text-muted-foreground">Stellen Sie einen neuen Urlaubsantrag</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Neuer Urlaubsantrag</CardTitle>
              <CardDescription>Füllen Sie das Formular aus, um einen Urlaubsantrag zu stellen</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Startdatum</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Enddatum</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Grund / Anmerkung</Label>
                  <Textarea
                    id="reason"
                    placeholder="z.B. Familienurlaub, Erholung, etc."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                {calculatedDays > remainingDays && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sie haben nicht genügend Urlaubstage verfügbar. Bitte passen Sie den Zeitraum an.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={!isValid} className="w-full">
                  Antrag einreichen
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Zusammenfassung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verfügbare Tage</span>
                <span className="font-medium">{remainingDays}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Beantragte Tage</span>
                <span className="font-medium text-primary">{calculatedDays || "-"}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Verbleibend nach Genehmigung</span>
                  <span className="font-medium">{calculatedDays ? remainingDays - calculatedDays : "-"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Anträge werden automatisch an Ihren Vorgesetzten zur Genehmigung weitergeleitet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
