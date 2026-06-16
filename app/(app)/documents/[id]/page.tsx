"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  FileText,
  Download,
  Trash2,
  Printer,
  Copy,
  Edit,
  ExternalLink,
  Save,
  Clock,
  Briefcase,
  Sparkles,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import Link from "next/link"

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  final: "bg-accent/10 text-accent",
  filed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { documents, cases, updateDocument, deleteDocument } = useAppStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")

  const doc = documents.find((d) => d.id === id)
  const linkedCase = doc?.caseId ? cases.find((c) => c.id === doc.caseId) : null

  if (!doc) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground">Document not found</h2>
        <p className="text-muted-foreground mt-2">The document you are looking for has been moved or deleted.</p>
        <Button className="mt-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    updateDocument(doc.id, { content: editedContent })
    setIsEditing(false)
    toast.success("Changes saved successfully")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      deleteDocument(doc.id)
      toast.success("Document deleted")
      router.back()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.content)
    toast.success("Content copied to clipboard")
  }

  const handleEditStart = () => {
    setEditedContent(doc.content)
    setIsEditing(true)
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground truncate max-w-[200px] sm:max-w-md">
                {doc.title}
              </h1>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[doc.status]}>{doc.status}</Badge>
                <span className="text-xs text-muted-foreground capitalize">{doc.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button variant="outline" size="icon" className="bg-transparent" onClick={handleEditStart}>
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="icon" onClick={handleSave}>
                <Save className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="min-h-[500px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                <div>
                  <CardTitle className="text-lg">Legal Document Content</CardTitle>
                  <CardDescription>Review or modify your generated draft</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {isEditing ? (
                  <Textarea
                    className="w-full h-full min-h-[500px] border-0 rounded-none focus-visible:ring-0 resize-none p-6 font-mono text-sm leading-relaxed"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  <div className="p-8 font-serif text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                    {doc.content}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Linked Case</p>
                  {linkedCase ? (
                    <Link
                      href={`/cases/${linkedCase.id}`}
                      className="text-sm font-medium text-accent hover:underline flex items-center gap-1"
                    >
                      <Briefcase className="h-3 w-3" />
                      {linkedCase.title}
                    </Link>
                  ) : (
                    <p className="text-sm text-foreground">No case linked</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Generated On</p>
                  <p className="text-sm font-medium text-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(doc.createdAt), "PPP")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium text-foreground">{format(new Date(doc.updatedAt), "PPP p")}</p>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
                  <Edit className="h-3 w-3 mr-2" />
                  Refine Wording
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
                  <FileText className="h-3 w-3 mr-2" />
                  Simplify Language
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs bg-transparent">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Check Compliance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
