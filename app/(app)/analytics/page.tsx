"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Clock, MessageSquare, Video, TrendingUp, Zap } from "lucide-react"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"

export default function AnalyticsPage() {
  const { callSessions, consultations } = useAppStore()

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = callSessions.length
    const activeSessions = callSessions.filter((s) => s.status === "active").length
    const totalMinutes = callSessions.reduce((acc, s) => acc + s.duration, 0) / 60
    const averageDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0
    const totalMessages = callSessions.reduce((acc, s) => acc + s.metadata.messagesCount, 0)

    // Monthly data for last 6 months
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const month = format(date, "MMM")
      const start = startOfMonth(date)
      const end = endOfMonth(date)

      const monthSessions = callSessions.filter((s) => {
        const sessionDate = new Date(s.startTime)
        return sessionDate >= start && sessionDate <= end
      })

      monthlyData.push({
        month,
        sessions: monthSessions.length,
        duration: Math.round(monthSessions.reduce((acc, s) => acc + s.duration, 0) / 60),
      })
    }

    // Quality distribution
    const qualityDistribution = {
      excellent: callSessions.filter((s) => s.metadata.networkQuality === "excellent").length,
      good: callSessions.filter((s) => s.metadata.networkQuality === "good").length,
      fair: callSessions.filter((s) => s.metadata.networkQuality === "fair").length,
      poor: callSessions.filter((s) => s.metadata.networkQuality === "poor").length,
    }

    // Lawyer usage
    const lawyerUsage = callSessions.reduce(
      (acc, s) => {
        const existing = acc.find((l) => l.name === s.lawyerId)
        if (existing) {
          existing.sessions += 1
          existing.totalTime += s.duration / 60
        } else {
          acc.push({
            name: s.lawyerId,
            sessions: 1,
            totalTime: s.duration / 60,
          })
        }
        return acc
      },
      [] as Array<{ name: string; sessions: number; totalTime: number }>,
    )

    return {
      totalSessions,
      activeSessions,
      totalMinutes: Math.round(totalMinutes),
      averageDuration: Math.round(averageDuration),
      totalMessages,
      monthlyData,
      qualityDistribution,
      lawyerUsage,
    }
  }, [callSessions])

  const qualityColors = {
    excellent: "#22c55e",
    good: "#3b82f6",
    fair: "#f59e0b",
    poor: "#ef4444",
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Analytics & Call History</h1>
            <p className="text-sm text-muted-foreground">Performance metrics and consultation data</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalSessions}</p>
                </div>
                <Video className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Duration</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalMinutes}m</p>
                </div>
                <Clock className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg. Duration</p>
                  <p className="text-3xl font-bold text-foreground">{stats.averageDuration}m</p>
                </div>
                <Zap className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Messages</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary/40" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Sessions and total duration by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sessions" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="duration" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Call Quality</CardTitle>
              <CardDescription>Network quality distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Excellent", value: stats.qualityDistribution.excellent },
                      { name: "Good", value: stats.qualityDistribution.good },
                      { name: "Fair", value: stats.qualityDistribution.fair },
                      { name: "Poor", value: stats.qualityDistribution.poor },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill={qualityColors.excellent} />
                    <Cell fill={qualityColors.good} />
                    <Cell fill={qualityColors.fair} />
                    <Cell fill={qualityColors.poor} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest consultation sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
              {callSessions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sessions yet. Start a consultation to see activity.</p>
                </div>
              ) : (
                callSessions
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .slice(0, 10)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-foreground">
                            {consultations.find((c) => c.id === session.consultationId)?.lawyerName || "Consultation"}
                          </p>
                          <p className="text-xs text-muted-foreground">{format(new Date(session.startTime), "PPp")}</p>
                        </div>
                        <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.round(session.duration / 60)}m
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {session.metadata.messagesCount} messages
                        </div>
                        {session.metadata.networkQuality && (
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                {
                                  excellent: "bg-green-500",
                                  good: "bg-blue-500",
                                  fair: "bg-yellow-500",
                                  poor: "bg-red-500",
                                }[session.metadata.networkQuality]
                              }`}
                            />
                            <span className="capitalize">{session.metadata.networkQuality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage by Lawyer */}
        {stats.lawyerUsage.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Lawyer Usage</CardTitle>
              <CardDescription>Consultations by lawyer</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.lawyerUsage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-primary)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalTime"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-accent)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
