"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { CalendarDays, ClipboardCheck, LayoutDashboard, Settings, Users, Building2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SidebarNav() {
  const pathname = usePathname()
  const { currentUser, setCurrentUser, vacationRequests } = useAppStore()

  const pendingCount = vacationRequests.filter((r) => r.status === "pending").length

  const employeeLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vacation/new", label: "Urlaub beantragen", icon: CalendarDays },
  ]

  const managerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vacation/new", label: "Urlaub beantragen", icon: CalendarDays },
    {
      href: "/approvals",
      label: "Genehmigungen",
      icon: ClipboardCheck,
      badge: pendingCount,
    },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vacation/new", label: "Urlaub beantragen", icon: CalendarDays },
    {
      href: "/approvals",
      label: "Genehmigungen",
      icon: ClipboardCheck,
      badge: pendingCount,
    },
    { href: "/admin/users", label: "Benutzer", icon: Users },
    { href: "/admin/departments", label: "Abteilungen", icon: Building2 },
    { href: "/admin/settings", label: "Einstellungen", icon: Settings },
  ]

  const links =
    currentUser?.role === "admin" ? adminLinks : currentUser?.role === "manager" ? managerLinks : employeeLinks

  const handleLogout = () => {
    setCurrentUser(null)
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">RealCore</span>
            <span className="text-xs text-muted-foreground">Industry & Materials</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.badge ? (
                <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground">
                  {link.badge}
                </Badge>
              ) : null}
            </Link>
          ))}
        </nav>

        {currentUser && (
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-md bg-sidebar-accent p-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {currentUser.role === "admin"
                    ? "Administrator"
                    : currentUser.role === "manager"
                      ? "Vorgesetzter"
                      : "Mitarbeiter"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-sidebar-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
