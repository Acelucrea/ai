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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"
import type { EvidenceType } from "@/lib/types"

const evidenceTypes: { value: EvidenceType; label: string }[] = [
  { value: "document", label: "Document" },
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "physical", label: "Physical Item" },
  { value: "witness_statement", label: "Witness Statement" },
  { value: "expert_report", label: "Expert Report" },
  { value: "other", label: "Other" },
]

export default function NewEvidencePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedCase = searchParams.get("case")

  const { cases, addEvidence } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    type: "" as EvidenceType,
    caseId: preselectedCase || "",
    description: "",
    source: "",
    dateObtained: new Date().toISOString().split("T")[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.caseId) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      addEvidence({
        caseId: formData.caseId,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        source: formData.source,
        dateObtained: new Date(formData.dateObtained),
        chainOfCustody: [
          {
            id: Math.random().toString(36).substring(2, 15),
            evidenceId: "",
            action: "Evidence added to vault",
            handledBy: "System",
            timestamp: new Date(),
          },
        ],
        metadata: {},
      })

      toast.success("Evidence added successfully")
      router.back()
    } catch {
      toast.error("Failed to add evidence")
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
            <h1 className="font-serif text-xl font-bold text-foreground">Add Evidence</h1>
            <p className="text-sm text-muted-foreground">Store evidence securely with chain of custody</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evidence Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Evidence Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rental Agreement Document"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Evidence Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: EvidenceType) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {evidenceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="case">Link to Case *</Label>
                  <Select
                    value={formData.caseId}
                    onValueChange={(value) => setFormData({ ...formData, caseId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select case" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the evidence and its relevance to the case..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Landlord, Witness"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateObtained">Date Obtained</Label>
                  <Input
                    id="dateObtained"
                    type="date"
                    value={formData.dateObtained}
                    onChange={(e) => setFormData({ ...formData, dateObtained: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload File (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop a file here, or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, images, audio, and video files up to 50MB</p>
                <Button variant="outline" className="mt-4 bg-transparent" type="button">
                  Choose File
                </Button>
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
                "Add Evidence"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
