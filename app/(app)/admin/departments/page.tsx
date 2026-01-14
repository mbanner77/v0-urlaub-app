"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import type { Department } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Building2, Users, Pencil } from "lucide-react"

export default function AdminDepartmentsPage() {
  const { currentUser, users, departments, addDepartment, updateDepartment } = useAppStore()
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    managerId: "",
  })

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const managers = users.filter((u) => u.role === "manager" || u.role === "admin")

  const handleOpenDialog = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept)
      setFormData({
        name: dept.name,
        managerId: dept.managerId,
      })
    } else {
      setEditingDept(null)
      setFormData({
        name: "",
        managerId: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingDept) {
      updateDepartment(editingDept.id, {
        name: formData.name,
        managerId: formData.managerId,
      })
    } else {
      addDepartment({
        id: `d${Date.now()}`,
        name: formData.name,
        managerId: formData.managerId,
      })
    }
    setIsDialogOpen(false)
  }

  const getDepartmentStats = (deptName: string) => {
    const deptUsers = users.filter((u) => u.department === deptName)
    const totalVacation = deptUsers.reduce((sum, u) => sum + u.totalVacationDays, 0)
    const usedVacation = deptUsers.reduce((sum, u) => sum + u.usedVacationDays, 0)
    return {
      employeeCount: deptUsers.length,
      totalVacation,
      usedVacation,
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Abteilungsverwaltung</h1>
          <p className="text-muted-foreground">Verwalten Sie Abteilungen und Zuordnungen</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Abteilung
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDept ? "Abteilung bearbeiten" : "Neue Abteilung"}</DialogTitle>
              <DialogDescription>
                {editingDept ? "Bearbeiten Sie die Abteilungsdaten" : "Erstellen Sie eine neue Abteilung"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Produktion"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manager">Abteilungsleiter</Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie einen Leiter..." />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={!formData.name}>
                {editingDept ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const manager = users.find((u) => u.id === dept.managerId)
          const stats = getDepartmentStats(dept.name)

          return (
            <Card key={dept.id} className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleOpenDialog(dept)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <CardDescription>{manager ? `Leitung: ${manager.name}` : "Kein Leiter"}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{stats.employeeCount} Mitarbeiter</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-primary">{stats.totalVacation - stats.usedVacation}</span>
                    <span className="text-muted-foreground"> / {stats.totalVacation} Tage</span>
                  </div>
                </div>
                {manager && (
                  <div className="mt-4 flex items-center gap-3 rounded-md bg-secondary p-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {manager.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{manager.name}</p>
                      <p className="text-xs text-muted-foreground">Abteilungsleiter</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
