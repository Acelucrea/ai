"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function NewCourtDatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCase = searchParams.get("case")

  const { cases, addCourtDate } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    caseId: preselectedCase || "",
    date: "",
    time: "09:00",
    courtName: "",
    courtRoom: "",
    purpose: "",
    notes: "",
    reminder: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.caseId || !formData.date || !formData.courtName || !formData.purpose) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      addCourtDate({
        caseId: formData.caseId,
        date: new Date(formData.date),
        time: formData.time,
        courtName: formData.courtName,
        courtRoom: formData.courtRoom || undefined,
        purpose: formData.purpose,
        notes: formData.notes || undefined,
        reminder: formData.reminder,
      })

      toast.success("Court date added successfully")
      router.back()
    } catch {
      toast.error("Failed to add court date")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Add Court Date</h1>
            <p className="text-sm text-muted-foreground">Schedule a hearing or court appearance</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Court Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="case">Case *</Label>
                <Select value={formData.caseId} onValueChange={(value) => setFormData({ ...formData, caseId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                  <SelectContent>
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Input
                  id="purpose"
                  placeholder="e.g., First Hearing, Motion Hearing, Judgment"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name *</Label>
                  <Input
                    id="courtName"
                    placeholder="e.g., Lagos High Court"
                    value={formData.courtName}
                    onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courtRoom">Court Room</Label>
                  <Input
                    id="courtRoom"
                    placeholder="e.g., Room 5A"
                    value={formData.courtRoom}
                    onChange={(e) => setFormData({ ...formData, courtRoom: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes or preparation reminders..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Set Reminder</p>
                  <p className="text-sm text-muted-foreground">Get notified before the court date</p>
                </div>
                <Switch
                  checked={formData.reminder}
                  onCheckedChange={(checked) => setFormData({ ...formData, reminder: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Court Date"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
