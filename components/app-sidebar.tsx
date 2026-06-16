"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import {
  Scale,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  FileText,
  Shield,
  Calendar,
  Settings,
  LogOut,
  Gavel,
  Video,
  Users,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/consultations", label: "Video Consultations", icon: Video },
  { href: "/lawyers", label: "Lawyer Directory", icon: Users },
  { href: "/cases", label: "My Cases", icon: Briefcase },
  { href: "/evidence", label: "Evidence Vault", icon: Shield },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/calendar", label: "Court Calendar", icon: Calendar },
  { href: "/simulation", label: "Court Prep", icon: Gavel },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAppStore()

  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Scale className="h-8 w-8 text-sidebar-primary" />
          <span className="font-serif text-xl font-bold text-sidebar-foreground">LegalAide</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <span className="text-sidebar-primary font-semibold">{user?.name?.[0]?.toUpperCase() || "U"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
