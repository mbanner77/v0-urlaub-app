"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Building2, Bell, Shield, Calendar } from "lucide-react"

export default function AdminSettingsPage() {
  const { currentUser } = useAppStore()

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">Systemweite Konfigurationen verwalten</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Unternehmensdaten</CardTitle>
                <CardDescription>Grundlegende Unternehmensinformationen</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Firmenname</Label>
              <Input id="companyName" defaultValue="RealCore Industry & Materials" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Kontakt E-Mail</Label>
              <Input id="companyEmail" type="email" defaultValue="hr@realcore.de" />
            </div>
            <Button className="mt-2">Speichern</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Urlaubsregeln</CardTitle>
                <CardDescription>Standard-Urlaubskonfiguration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultDays">Standard-Urlaubstage pro Jahr</Label>
              <Input id="defaultDays" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carryOver">Maximale Übertragung ins nächste Jahr</Label>
              <Input id="carryOver" type="number" defaultValue="5" />
            </div>
            <Button className="mt-2">Speichern</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Benachrichtigungen</CardTitle>
                <CardDescription>E-Mail-Benachrichtigungen konfigurieren</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Neue Anträge</p>
                <p className="text-sm text-muted-foreground">Benachrichtigung bei neuen Urlaubsanträgen</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Genehmigungen</p>
                <p className="text-sm text-muted-foreground">Benachrichtigung bei Genehmigung/Ablehnung</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Erinnerungen</p>
                <p className="text-sm text-muted-foreground">Erinnerung an ausstehende Genehmigungen</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Sicherheit</CardTitle>
                <CardDescription>Sicherheitseinstellungen verwalten</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Zwei-Faktor-Authentifizierung</p>
                <p className="text-sm text-muted-foreground">2FA für alle Benutzer erforderlich</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Aktivitätsprotokoll</p>
                <p className="text-sm text-muted-foreground">Alle Aktionen protokollieren</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
