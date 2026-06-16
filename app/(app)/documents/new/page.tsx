"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Sparkles, FileText } from "lucide-react"
import { toast } from "sonner"
import type { DocumentType } from "@/lib/types"

const documentTypes: { value: DocumentType; label: string; description: string }[] = [
  { value: "affidavit", label: "Affidavit", description: "Sworn statement of facts" },
  { value: "motion", label: "Motion", description: "Request to the court" },
  { value: "petition", label: "Petition", description: "Formal written request" },
  { value: "contract", label: "Contract", description: "Legal agreement" },
  { value: "letter", label: "Letter", description: "Formal correspondence" },
  { value: "brief", label: "Legal Brief", description: "Argument for the court" },
  { value: "statement", label: "Statement", description: "Written account" },
  { value: "notice", label: "Notice", description: "Official notification" },
]

export default function NewDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedType = searchParams.get("type") as DocumentType | null
  const preselectedCase = searchParams.get("case")

  const { user, cases, addDocument } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    type: preselectedType || ("affidavit" as DocumentType), // Updated default value
    caseId: preselectedCase || "",
    content: "",
    prompt: "",
  })

  const handleGenerate = async () => {
    if (!formData.type || !formData.prompt) {
      toast.error("Please select a document type and provide details")
      return
    }

    setIsGenerating(true)

    // Simulate AI generation - in production this would call the AI SDK
    setTimeout(() => {
      const generatedContent = generateMockDocument(formData.type, formData.prompt)
      setFormData({ ...formData, content: generatedContent })
      toast.success("Document generated! Review and edit as needed.")
      setIsGenerating(false)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.type || !formData.content) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      addDocument({
        userId: user?.id || "",
        caseId: formData.caseId || undefined,
        title: formData.title,
        type: formData.type,
        content: formData.content,
        status: "draft",
      })

      toast.success("Document saved successfully")
      router.push("/documents")
    } catch {
      toast.error("Failed to save document")
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
            <h1 className="font-serif text-xl font-bold text-foreground">Generate Document</h1>
            <p className="text-sm text-muted-foreground">Create legal documents with AI assistance</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Type</CardTitle>
              <CardDescription>Select the type of document you need</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      formData.type === type.value
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <FileText
                      className={`h-5 w-5 mb-2 ${
                        formData.type === type.value ? "text-accent" : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Generation */}
          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Generation
              </CardTitle>
              <CardDescription>Describe what you need and our AI will generate a draft</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your document</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., An affidavit stating that I have been living at 123 Main Street for the past 5 years and I am the rightful tenant..."
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="case">Link to Case (Optional)</Label>
                <Select value={formData.caseId} onValueChange={(value) => setFormData({ ...formData, caseId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No case</SelectItem> {/* Updated value prop */}
                    {cases.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !formData.type}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Document Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
              <CardDescription>Review and edit the generated document</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Affidavit of Residence"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Document content will appear here after generation, or you can write it manually..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                  required
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
                  Saving...
                </>
              ) : (
                "Save Document"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function generateMockDocument(type: DocumentType, prompt: string): string {
  const today = new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  if (type === "affidavit") {
    return `AFFIDAVIT

IN THE HIGH COURT OF LAGOS STATE
IN THE LAGOS JUDICIAL DIVISION
HOLDEN AT LAGOS

AFFIDAVIT IN SUPPORT OF [MOTION/APPLICATION]

I, [YOUR FULL NAME], adult, [Nigerian/Nationality], of [Your Address], do make oath and say as follows:

1. That I am the [Applicant/Claimant/Defendant] in this matter and by virtue of my position, I am familiar with the facts deposed to herein.

2. That I have the authority and consent of all parties concerned to depose to this Affidavit.

3. ${prompt}

4. That I make this Affidavit in good faith, believing the contents to be true and correct in accordance with the Oaths Act.

5. That I make this Affidavit in support of [the Motion/Application] filed in this Honourable Court.


_____________________________
DEPONENT


SWORN TO at the High Court Registry, Lagos
this ${today}

BEFORE ME


_____________________________
COMMISSIONER FOR OATHS`
  }

  if (type === "notice") {
    return `NOTICE

Date: ${today}

TO: [Recipient's Name]
[Recipient's Address]

RE: [SUBJECT MATTER]

Dear Sir/Madam,

TAKE NOTICE that pursuant to [relevant law/agreement], the following notice is hereby given:

${prompt}

You are hereby required to [take specified action/respond/comply] within [timeframe] days from the date of this Notice.

TAKE FURTHER NOTICE that failure to comply with this Notice may result in [consequences].

Dated this ${today}


_____________________________
[Your Name]
[Your Address]
[Your Phone Number]`
  }

  return `LEGAL DOCUMENT

Document Type: ${type.charAt(0).toUpperCase() + type.slice(1)}
Date: ${today}

PARTIES:
[Party A Name and Address]
AND
[Party B Name and Address]

RECITALS:

WHEREAS the parties wish to formalize the following:

${prompt}

NOW THEREFORE, the parties agree as follows:

1. [First clause]

2. [Second clause]

3. [Third clause]

IN WITNESS WHEREOF, the parties have executed this document as of the date first written above.


_____________________________          _____________________________
[Party A Signature]                    [Party B Signature]
[Party A Name]                         [Party B Name]`
}
