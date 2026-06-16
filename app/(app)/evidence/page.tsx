"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Plus,
  Search,
  FileText,
  ImageIcon,
  Video,
  AudioLines,
  Box,
  Users,
  FileSearch,
  ChevronRight,
} from "lucide-react"
import { format } from "date-fns"
import type { EvidenceType } from "@/lib/types"

const evidenceIcons: Record<EvidenceType, React.ElementType> = {
  document: FileText,
  photo: ImageIcon,
  video: Video,
  audio: AudioLines,
  physical: Box,
  witness_statement: Users,
  expert_report: FileSearch,
  other: Shield,
}

export default function EvidencePage() {
  const { evidence, cases } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvidence = evidence.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCase = (caseId: string) => cases.find((c) => c.id === caseId)

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Evidence Vault</h1>
            <p className="text-muted-foreground text-sm">
              {evidence.length} item{evidence.length !== 1 ? "s" : ""} stored securely
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/evidence/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Evidence</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      <div className="p-4 md:p-6">
        {filteredEvidence.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {evidence.length === 0 ? "No evidence yet" : "No matching evidence"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {evidence.length === 0
                ? "Add evidence to your cases for secure storage and tracking"
                : "Try adjusting your search"}
            </p>
            {evidence.length === 0 && (
              <Button asChild>
                <Link href="/evidence/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Evidence
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvidence.map((item) => {
              const Icon = evidenceIcons[item.type]
              const linkedCase = getCase(item.caseId)

              return (
                <Link key={item.id} href={`/evidence/${item.id}`}>
                  <Card className="hover:border-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                            <Badge variant="outline" className="capitalize text-xs">
                              {item.type.replace("_", " ")}
                            </Badge>
                          </div>
                          {linkedCase && <p className="text-sm text-accent mb-1">Case: {linkedCase.title}</p>}
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Source: {item.source}</span>
                            <span>{format(new Date(item.dateObtained), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
