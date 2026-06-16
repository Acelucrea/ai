"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Video, Plus, Clock, Calendar, ChevronRight } from "lucide-react"
import { format, isAfter } from "date-fns"

export default function ConsultationsPage() {
  const { consultations = [] } = useAppStore()

  const upcomingConsultations = consultations
    .filter((c) => isAfter(new Date(c.scheduledAt), new Date()))
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())

  const pastConsultations = consultations
    .filter((c) => !isAfter(new Date(c.scheduledAt), new Date()))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">Consultations</h1>
              <p className="text-sm text-muted-foreground">Video calls with AI lawyers</p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/consultations/new">
              <Plus className="h-4 w-4 mr-2" />
              Schedule
            </Link>
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Upcoming */}
        {upcomingConsultations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Consultations</h2>
            <div className="space-y-3">
              {upcomingConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">{consultation.lawyerName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{consultation.topic}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(consultation.scheduledAt), "MMM d, yyyy")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(consultation.scheduledAt), "h:mm a")}
                          </div>
                        </div>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90" asChild>
                        <Link href={`/consultations/${consultation.id}`}>
                          Join Call
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past */}
        {pastConsultations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Past Consultations</h2>
            <div className="space-y-3">
              {pastConsultations.slice(0, 5).map((consultation) => (
                <Card key={consultation.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">{consultation.lawyerName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{consultation.topic}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(consultation.scheduledAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <Button variant="outline" className="bg-transparent" asChild>
                        <Link href={`/consultations/${consultation.id}`}>
                          Review
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {consultations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No consultations scheduled</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Schedule a video call with an AI lawyer to get expert legal guidance
              </p>
              <Button className="bg-primary hover:bg-primary/90" asChild>
                <Link href="/consultations/new">Schedule Consultation</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
