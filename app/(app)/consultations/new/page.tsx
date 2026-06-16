"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"

const lawyerProfiles = [
  { id: "lawyer-1", name: "Chioma Okafor", specialization: "Employment Law", rating: 4.8 },
  { id: "lawyer-2", name: "Adebayo Osei", specialization: "Property Law", rating: 4.9 },
  { id: "lawyer-3", name: "Ngozi Eze", specialization: "Family Law", rating: 4.7 },
  { id: "lawyer-4", name: "Tunde Ibrahim", specialization: "Corporate Law", rating: 4.8 },
  { id: "lawyer-5", name: "Zainab Hassan", specialization: "Immigration Law", rating: 4.6 },
]

const topics = [
  "General Legal Advice",
  "Case Strategy Review",
  "Document Review",
  "Contract Consultation",
  "Dispute Resolution",
  "Contract Negotiation",
]

export default function NewConsultationPage() {
  const router = useRouter()
  const { addConsultation } = useAppStore()
  const [selectedLawyer, setSelectedLawyer] = useState("")
  const [topic, setTopic] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const lawyer = lawyerProfiles.find((l) => l.id === selectedLawyer)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLawyer || !topic || !date || !time) return

    setIsSubmitting(true)

    const scheduledAt = new Date(`${date}T${time}`).toISOString()

    addConsultation({
      id: Date.now().toString(),
      lawyerName: lawyerProfiles.find((l) => l.id === selectedLawyer)?.name || "Unknown",
      lawyerSpecialization: lawyerProfiles.find((l) => l.id === selectedLawyer)?.specialization || "",
      topic,
      description,
      scheduledAt,
      status: "scheduled",
      duration: 60,
      notes: "",
    })

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/consultations")
    }, 800)
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/consultations">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Schedule Consultation</h1>
            <p className="text-sm text-muted-foreground">Book a video call with an AI lawyer</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lawyer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Lawyer</CardTitle>
              <CardDescription>Choose an AI lawyer specialist for your consultation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedLawyer} onValueChange={setSelectedLawyer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lawyer..." />
                </SelectTrigger>
                <SelectContent>
                  {lawyerProfiles.map((lawyer) => (
                    <SelectItem key={lawyer.id} value={lawyer.id}>
                      {lawyer.name} • {lawyer.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {lawyer && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-medium text-foreground">{lawyer.name}</h3>
                  <p className="text-sm text-muted-foreground">{lawyer.specialization}</p>
                  <p className="text-sm text-accent mt-1">★ {lawyer.rating} rating</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Topic & Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultation topic..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your legal issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href="/consultations">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={!selectedLawyer || !topic || !date || !time || isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Consultation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
