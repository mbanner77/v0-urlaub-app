"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import type { VacationRequest } from "@/lib/types"
import { CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function ApprovalsPage() {
  const { currentUser, vacationRequests, updateVacationRequest, users } = useAppStore()
  const [selectedRequest, setSelectedRequest] = useState<VacationRequest | null>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null)

  if (!currentUser || (currentUser.role !== "manager" && currentUser.role !== "admin")) {
    return null
  }

  // Get requests that this user can approve
  const managedUserIds =
    currentUser.role === "admin"
      ? users.map((u) => u.id)
      : users.filter((u) => u.managerId === currentUser.id).map((u) => u.id)

  const relevantRequests = vacationRequests.filter((r) => managedUserIds.includes(r.userId))

  const pendingRequests = relevantRequests.filter((r) => r.status === "pending")
  const processedRequests = relevantRequests.filter((r) => r.status !== "pending")

  const handleAction = (action: "approve" | "reject") => {
    if (!selectedRequest) return

    updateVacationRequest(selectedRequest.id, {
      status: action === "approve" ? "approved" : "rejected",
      reviewedBy: currentUser.name,
      reviewedAt: new Date().toISOString().split("T")[0],
      reviewComment: reviewComment || undefined,
    })

    setSelectedRequest(null)
    setReviewComment("")
    setDialogAction(null)
  }

  const openDialog = (request: VacationRequest, action: "approve" | "reject") => {
    setSelectedRequest(request)
    setDialogAction(action)
  }

  const RequestCard = ({
    request,
    showActions = true,
  }: {
    request: VacationRequest
    showActions?: boolean
  }) => {
    const user = users.find((u) => u.id === request.userId)

    return (
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {request.userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{request.userName}</p>
            <p className="text-sm text-muted-foreground">{request.userDepartment}</p>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(request.startDate)} - {formatDate(request.endDate)} ({request.days} Tage)
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Grund: {request.reason}</p>
            {user && (
              <p className="mt-1 text-xs text-muted-foreground">
                Verfügbar: {user.totalVacationDays - user.usedVacationDays} Tage
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {request.status === "pending" && showActions ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                onClick={() => openDialog(request, "reject")}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Ablehnen
              </Button>
              <Button
                size="sm"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => openDialog(request, "approve")}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Genehmigen
              </Button>
            </>
          ) : (
            <Badge
              variant="secondary"
              className={
                request.status === "approved"
                  ? "bg-accent/20 text-accent"
                  : request.status === "rejected"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-warning/20 text-warning"
              }
            >
              {request.status === "approved" ? "Genehmigt" : request.status === "rejected" ? "Abgelehnt" : "Ausstehend"}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Genehmigungen</h1>
        <p className="text-muted-foreground">Verwalten Sie Urlaubsanträge Ihrer Mitarbeiter</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ausstehend</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Genehmigt</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedRequests.filter((r) => r.status === "approved").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Abgelehnt</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedRequests.filter((r) => r.status === "rejected").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Ausstehend ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="processed">Bearbeitet ({processedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ausstehende Anträge</CardTitle>
              <CardDescription>Anträge, die auf Ihre Genehmigung warten</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-accent/50" />
                  <p className="mt-4 text-sm text-muted-foreground">Keine ausstehenden Anträge vorhanden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bearbeitete Anträge</CardTitle>
              <CardDescription>Bereits genehmigte oder abgelehnte Anträge</CardDescription>
            </CardHeader>
            <CardContent>
              {processedRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">Keine bearbeiteten Anträge vorhanden.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {processedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions={false} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogAction !== null}
        onOpenChange={() => {
          setDialogAction(null)
          setSelectedRequest(null)
          setReviewComment("")
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogAction === "approve" ? "Antrag genehmigen" : "Antrag ablehnen"}</DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? "Möchten Sie diesen Urlaubsantrag genehmigen?"
                : "Möchten Sie diesen Urlaubsantrag ablehnen?"}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="rounded-lg bg-secondary p-4">
              <p className="font-medium">{selectedRequest.userName}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedRequest.startDate)} - {formatDate(selectedRequest.endDate)} ({selectedRequest.days}{" "}
                Tage)
              </p>
              <p className="mt-1 text-sm">Grund: {selectedRequest.reason}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Kommentar (optional)</label>
            <Textarea
              placeholder="Fügen Sie einen Kommentar hinzu..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null)
                setSelectedRequest(null)
                setReviewComment("")
              }}
            >
              Abbrechen
            </Button>
            <Button
              variant={dialogAction === "approve" ? "default" : "destructive"}
              onClick={() => handleAction(dialogAction!)}
            >
              {dialogAction === "approve" ? "Genehmigen" : "Ablehnen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
