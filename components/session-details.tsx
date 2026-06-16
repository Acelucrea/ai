"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Share2, Clock, MessageSquare, FileText } from "lucide-react"
import type { CallSession } from "@/lib/types"
import { format } from "date-fns"

interface SessionDetailsProps {
  session: CallSession
}

export function SessionDetails({ session }: SessionDetailsProps) {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const parts = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    if (s > 0 || parts.length === 0) parts.push(`${s}s`)
    return parts.join(" ")
  }

  const getQualityColor = (quality?: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-500/20 text-green-700"
      case "good":
        return "bg-blue-500/20 text-blue-700"
      case "fair":
        return "bg-yellow-500/20 text-yellow-700"
      case "poor":
        return "bg-red-500/20 text-red-700"
      default:
        return "bg-gray-500/20 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>{format(new Date(session.startTime), "PPpp")}</CardDescription>
          </div>
          <Badge variant={session.status === "active" ? "default" : "secondary"}>{session.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Duration and Quality */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground">{formatDuration(session.duration)}</p>
            </div>
          </div>

          {session.metadata.networkQuality && (
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${getQualityColor(session.metadata.networkQuality).split(" ")[0]}`}
              />
              <div>
                <p className="text-xs text-muted-foreground">Network</p>
                <p className="font-semibold text-foreground capitalize">{session.metadata.networkQuality}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Messages</p>
            </div>
            <p className="font-semibold text-foreground">{session.metadata.messagesCount}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Documents</p>
            </div>
            <p className="font-semibold text-foreground">{session.metadata.documentsSent}</p>
          </div>

          {session.metadata.qualityScore !== undefined && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Quality Score</p>
              <p className="font-semibold text-foreground">{session.metadata.qualityScore}%</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {session.recordingUrl && (
            <Button variant="outline" className="gap-2 bg-transparent" size="sm">
              <Download className="h-4 w-4" />
              Download Recording
            </Button>
          )}

          {session.transcript && (
            <Button variant="outline" className="gap-2 bg-transparent" size="sm">
              <Copy className="h-4 w-4" />
              Copy Transcript
            </Button>
          )}

          <Button variant="outline" className="gap-2 bg-transparent" size="sm">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Notes */}
        {session.notes && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm font-medium text-foreground mb-2">Session Notes</p>
            <p className="text-sm text-foreground">{session.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
