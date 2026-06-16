"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, ChevronRight, Download, Sparkles } from "lucide-react"
import { format } from "date-fns"

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  final: "bg-accent/10 text-accent",
  filed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export default function DocumentsPage() {
  const { documents, cases } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocuments = documents.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const getCase = (caseId?: string) => (caseId ? cases.find((c) => c.id === caseId) : null)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground text-sm">Generate and manage legal documents</p>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/documents/new">
              <Sparkles className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Generate</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      <div className="p-4 md:p-6">
        {/* Quick Templates */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Quick Templates</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {["Affidavit", "Motion", "Petition", "Contract", "Notice"].map((template) => (
              <Button key={template} variant="outline" size="sm" className="shrink-0 bg-transparent" asChild>
                <Link href={`/documents/new?type=${template.toLowerCase()}`}>
                  <Plus className="h-3 w-3 mr-1" />
                  {template}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {documents.length === 0 ? "No documents yet" : "No matching documents"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {documents.length === 0 ? "Generate legal documents with AI assistance" : "Try adjusting your search"}
            </p>
            {documents.length === 0 && (
              <Button asChild>
                <Link href="/documents/new">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Your First Document
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              const linkedCase = getCase(doc.caseId)

              return (
                <Card key={doc.id} className="hover:border-accent/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                          <Badge className={statusColors[doc.status]}>{doc.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize mb-1">{doc.type}</p>
                        {linkedCase && <p className="text-sm text-accent">Case: {linkedCase.title}</p>}
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
  )
}
