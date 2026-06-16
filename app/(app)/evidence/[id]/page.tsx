"use client"

import { cn } from "@/lib/utils"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Shield,
  FileText,
  ImageIcon,
  Video,
  AudioLines,
  Box,
  Users,
  FileSearch,
  History,
  Info,
  ExternalLink,
  Trash2,
  Lock,
} from "lucide-react"
import { format } from "date-fns"
import type { EvidenceType } from "@/lib/types"
import { toast } from "sonner"

const evidenceIcons: Record<EvidenceType, any> = {
  document: FileText,
  photo: ImageIcon,
  video: Video,
  audio: AudioLines,
  physical: Box,
  witness_statement: Users,
  expert_report: FileSearch,
  other: Shield,
}

export default function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const { evidence, cases, deleteEvidence } = useAppStore()

  const item = evidence.find((e) => e.id === id)
  const linkedCase = cases.find((c) => c.id === item?.caseId)

  if (!item) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold text-foreground">Evidence not found</h2>
        <p className="text-muted-foreground mt-2">
          The evidence item you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const Icon = evidenceIcons[item.type]

  const handleDelete = () => {
    if (confirm("Are you sure you want to remove this evidence? This action cannot be undone.")) {
      deleteEvidence(item.id)
      toast.success("Evidence removed from vault")
      router.back()
    }
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
                {item.name}
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize text-[10px] h-5">
                  {item.type.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Secure Vault
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
        {/* Status Card */}
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center">
                <Icon className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-foreground">Verified Evidence</h2>
                <p className="text-sm text-muted-foreground">
                  Linked to case: <span className="text-accent font-medium">{linkedCase?.title || "Unknown Case"}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Obtained on {format(new Date(item.dateObtained), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Chain of Custody
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
                <CardDescription>System-tracked information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Source</p>
                    <p className="font-medium text-foreground">{item.source || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Date Logged</p>
                    <p className="font-medium text-foreground">{format(new Date(item.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Storage Status</p>
                    <p className="font-medium text-green-600 dark:text-green-400">Encrypted</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Evidence ID</p>
                    <p className="font-mono text-[10px] text-foreground">{item.id}</p>
                  </div>
                </div>

                {item.fileUrl && (
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                      View Original File
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tracking Log</CardTitle>
                <CardDescription>Verifiable history of evidence handling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border">
                  {item.chainOfCustody.map((entry, index) => (
                    <div key={entry.id} className="relative flex items-start gap-6">
                      <div
                        className={cn(
                          "absolute -left-0.5 mt-1.5 h-4 w-4 rounded-full border-2 border-background z-10",
                          index === 0 ? "bg-accent" : "bg-muted-foreground",
                        )}
                      />
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-foreground">{entry.action}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {format(new Date(entry.timestamp), "MMM d, HH:mm")}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Handled by: <span className="font-medium">{entry.handledBy}</span>
                        </p>
                        {entry.notes && (
                          <p className="text-xs italic text-muted-foreground bg-muted/30 p-2 rounded mt-1 border-l-2 border-accent/30">
                            &quot;{entry.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/5 border border-warning/20">
          <Shield className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-warning">Chain of Custody Notice</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              This evidence is digitally tracked. Any access or modification is logged automatically to maintain legal
              admissibility standards for Nigerian courts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
