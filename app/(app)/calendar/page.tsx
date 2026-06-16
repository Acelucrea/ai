"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Bell } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"

export default function CalendarPage() {
  const { courtDates, cases } = useAppStore()
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getCase = (caseId: string) => cases.find((c) => c.id === caseId)

  const getDatesForDay = (day: Date) => courtDates.filter((cd) => isSameDay(new Date(cd.date), day))

  const upcomingDates = courtDates
    .filter((cd) => new Date(cd.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Court Calendar</h1>
            <p className="text-muted-foreground text-sm">Track all your court dates and hearings</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/calendar/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Date</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Padding for first week */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const dayDates = getDatesForDay(day)
                const hasEvents = dayDates.length > 0

                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square p-1 rounded-lg text-center relative ${
                      isToday(day) ? "bg-accent text-accent-foreground" : hasEvents ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className={`text-sm ${!isSameMonth(day, currentMonth) ? "text-muted-foreground/50" : ""}`}>
                      {format(day, "d")}
                    </span>
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {dayDates.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-accent" />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Dates List */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Upcoming Court Dates</h3>
          {upcomingDates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming court dates</p>
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <Link href="/calendar/new">Schedule a Court Date</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingDates.map((courtDate) => {
                const linkedCase = getCase(courtDate.caseId)

                return (
                  <Card key={courtDate.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-xs text-primary font-medium">
                            {format(new Date(courtDate.date), "MMM")}
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {format(new Date(courtDate.date), "d")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{courtDate.purpose}</h4>
                          {linkedCase && <p className="text-sm text-accent mt-0.5">{linkedCase.title}</p>}
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {courtDate.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {courtDate.courtName}
                            </span>
                          </div>
                          {courtDate.reminder && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              Reminder set
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
