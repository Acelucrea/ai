"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Plus,
  ChevronRight,
  AlertCircle,
  Clock,
  Video,
} from "lucide-react"
import { format, isAfter, isBefore, addDays } from "date-fns"

export default function DashboardPage() {
  const { user, cases, documents, courtDates } = useAppStore()

  const activeCases = cases.filter((c) => !["won", "lost", "settled", "dismissed"].includes(c.status))
  const upcomingDates = courtDates
    .filter((cd) => isAfter(new Date(cd.date), new Date()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const urgentDates = upcomingDates.filter((cd) => isBefore(new Date(cd.date), addDays(new Date(), 7)))

  const stats = [
    {
      label: "Active Cases",
      value: activeCases.length,
      icon: Briefcase,
      href: "/cases",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Documents",
      value: documents.length,
      icon: FileText,
      href: "/documents",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Upcoming Hearings",
      value: upcomingDates.length,
      icon: Calendar,
      href: "/calendar",
      color: "text-chart-3",
      bg: "bg-chart-3/10",
    },
  ]

  const quickActions = [
    { label: "Ask AI Assistant", href: "/assistant", icon: MessageSquare },
    { label: "Video Consultation", href: "/consultations", icon: Video },
    { label: "New Case", href: "/cases/new", icon: Plus },
    { label: "Generate Document", href: "/documents/new", icon: FileText },
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s an overview of your legal matters</p>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Urgent Alert */}
        {urgentDates.length > 0 && (
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Upcoming Court Date</p>
                <p className="text-sm text-muted-foreground">
                  You have {urgentDates.length} hearing{urgentDates.length > 1 ? "s" : ""} in the next 7 days
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-accent/50 transition-colors h-full">
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 bg-transparent"
                  asChild
                >
                  <Link href={action.href}>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Recent Cases</CardTitle>
              <CardDescription>Your latest case activity</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cases">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {activeCases.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No active cases yet</p>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
                  <Link href="/cases/new">Create Your First Case</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeCases.slice(0, 3).map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/cases/${caseItem.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        caseItem.status === "active"
                          ? "bg-accent"
                          : caseItem.status === "hearing_scheduled"
                            ? "bg-warning"
                            : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{caseItem.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {caseItem.caseType.replace("_", " ")} • {caseItem.status.replace("_", " ")}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Court Dates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Upcoming Hearings</CardTitle>
              <CardDescription>Your scheduled court appearances</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/calendar">
                View calendar
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingDates.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming court dates</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDates.map((courtDate) => (
                  <div key={courtDate.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-xs text-primary font-medium">
                        {format(new Date(courtDate.date), "MMM")}
                      </span>
                      <span className="text-lg font-bold text-primary">{format(new Date(courtDate.date), "d")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{courtDate.purpose}</p>
                      <p className="text-sm text-muted-foreground">{courtDate.courtName}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {courtDate.time}
                      </div>
                    </div>
                    {isBefore(new Date(courtDate.date), addDays(new Date(), 3)) && (
                      <span className="px-2 py-1 text-xs rounded-full bg-warning/10 text-warning font-medium">
                        Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Assistant Promo */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Need Legal Guidance?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ask our AI assistant any legal question about Nigerian law and get instant, easy-to-understand
                  answers.
                </p>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/assistant">
                    Start Conversation
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
