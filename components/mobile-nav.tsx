"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, MessageSquare, Briefcase, Menu, Video } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./app-sidebar"

const mobileNavItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/assistant", label: "AI", icon: MessageSquare },
  { href: "/consultations", label: "Video", icon: Video },
  { href: "/cases", label: "Cases", icon: Briefcase },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[4rem] py-2",
                isActive ? "text-accent" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="min-w-[4rem] h-full rounded-none">
              <div className="flex flex-col items-center gap-1">
                <Menu className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <AppSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
