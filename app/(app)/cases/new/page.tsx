"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { CaseType, CaseStatus } from "@/lib/types"

const caseTypes: { value: CaseType; label: string }[] = [
  { value: "criminal", label: "Criminal" },
  { value: "civil", label: "Civil" },
  { value: "family", label: "Family" },
  { value: "land", label: "Land/Property" },
  { value: "employment", label: "Employment" },
  { value: "constitutional", label: "Constitutional" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
]

export default function NewCasePage() {
  const router = useRouter()
  const { user, addCase } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    caseNumber: "",
    caseType: "" as CaseType,
    status: "draft" as CaseStatus,
    description: "",
    opposingParty: "",
    courtName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.caseType) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      const newCase = addCase({
        userId: user?.id || "",
        title: formData.title,
        caseNumber: formData.caseNumber || undefined,
        caseType: formData.caseType,
        status: formData.status,
        description: formData.description,
        opposingParty: formData.opposingParty || undefined,
        courtName: formData.courtName || undefined,
      })

      toast.success("Case created successfully")
      router.push(`/cases/${newCase.id}`)
    } catch {
      toast.error("Failed to create case")
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
            <h1 className="font-serif text-xl font-bold text-foreground">New Case</h1>
            <p className="text-sm text-muted-foreground">Add a new legal matter to track</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Tenancy Dispute with ABC Properties"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caseType">Case Type *</Label>
                  <Select
                    value={formData.caseType}
                    onValueChange={(value: CaseType) => setFormData({ ...formData, caseType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    placeholder="e.g., LD/1234/2024"
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the case details, background, and key issues..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parties & Court</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="opposingParty">Opposing Party</Label>
                <Input
                  id="opposingParty"
                  placeholder="Name of the other party"
                  value={formData.opposingParty}
                  onChange={(e) => setFormData({ ...formData, opposingParty: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courtName">Court Name</Label>
                <Input
                  id="courtName"
                  placeholder="e.g., Lagos State High Court"
                  value={formData.courtName}
                  onChange={(e) => setFormData({ ...formData, courtName: e.target.value })}
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
                  Creating...
                </>
              ) : (
                "Create Case"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
