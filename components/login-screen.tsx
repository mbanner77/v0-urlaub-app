"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield, Users, User } from "lucide-react"

export function LoginScreen() {
  const { users, setCurrentUser } = useAppStore()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: "employee",
      label: "Mitarbeiter",
      description: "Urlaubsanträge stellen und eigenen Status einsehen",
      icon: User,
    },
    {
      id: "manager",
      label: "Vorgesetzter",
      description: "Anträge genehmigen und Team-Übersicht",
      icon: Users,
    },
    {
      id: "admin",
      label: "Administrator",
      description: "Vollständiger Zugriff auf alle Funktionen",
      icon: Shield,
    },
  ]

  const filteredUsers = selectedRole ? users.filter((u) => u.role === selectedRole) : users

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-9 w-9 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">RealCore Industry & Materials</h1>
            <p className="mt-2 text-muted-foreground">Urlaubsverwaltung - Bitte wählen Sie Ihren Benutzer</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                selectedRole === role.id ? "border-primary bg-secondary" : ""
              }`}
              onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <role.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{role.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{role.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedRole ? `${roles.find((r) => r.id === selectedRole)?.label} auswählen` : "Alle Benutzer"}
            </CardTitle>
            <CardDescription>Klicken Sie auf einen Benutzer, um sich anzumelden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4 bg-transparent"
                  onClick={() => setCurrentUser(user)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.department}</span>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {user.role === "admin" ? "Admin" : user.role === "manager" ? "Manager" : "Mitarbeiter"}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
