"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Calendar, FileText, Shield, MessageSquare, MoreVertical, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"
import type { CaseStatus } from "@/lib/types"

const statusColors: Record<CaseStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-accent/10 text-accent",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hearing_scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  awaiting_judgment: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  won: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  lost: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  settled: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  appealed: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
}

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { getCase, deleteCase, getEvidenceByCase, documents, courtDates } = useAppStore()

  const caseData = getCase(id)
  const caseEvidence = getEvidenceByCase(id)
  const caseDocuments = documents.filter((d) => d.caseId === id)
  const caseDates = courtDates.filter((cd) => cd.caseId === id)

  if (!caseData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Case not found</p>
          <Button onClick={() => router.push("/cases")}>Back to Cases</Button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    deleteCase(id)
    toast.success("Case deleted")
    router.push("/cases")
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
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold text-foreground truncate max-w-[200px] sm:max-w-none">
                  {caseData.title}
                </h1>
                <Badge className={statusColors[caseData.status]}>{caseData.status.replace("_", " ")}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{caseData.caseNumber || "No case number assigned"}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Case
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/assistant?case=${id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask AI About This Case
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Case
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this case?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the case and all associated evidence, documents, and court dates.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
            <TabsTrigger value="dates">Dates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Case Type</p>
                    <p className="font-medium capitalize">{caseData.caseType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{caseData.status.replace("_", " ")}</p>
                  </div>
                  {caseData.courtName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Court</p>
                      <p className="font-medium">{caseData.courtName}</p>
                    </div>
                  )}
                  {caseData.opposingParty && (
                    <div>
                      <p className="text-sm text-muted-foreground">Opposing Party</p>
                      <p className="font-medium">{caseData.opposingParty}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{format(new Date(caseData.createdAt), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(new Date(caseData.updatedAt), "MMM d, yyyy")}</p>
                  </div>
                </div>

                {caseData.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-foreground leading-relaxed">{caseData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
                  <p className="text-2xl font-bold">{caseEvidence.length}</p>
                  <p className="text-xs text-muted-foreground">Evidence Items</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{caseDocuments.length}</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-chart-3" />
                  <p className="text-2xl font-bold">{caseDates.length}</p>
                  <p className="text-xs text-muted-foreground">Court Dates</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evidence">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Evidence Vault</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/evidence/new?case=${id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {caseEvidence.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No evidence added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseEvidence.map((evidence) => (
                      <div key={evidence.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Shield className="h-5 w-5 text-accent" />
                        <div className="flex-1">
                          <p className="font-medium">{evidence.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{evidence.type.replace("_", " ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Documents</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/documents/new?case=${id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Generate
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {caseDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No documents yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {doc.type} • {doc.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Court Dates</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/calendar/new?case=${id}`}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {caseDates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No court dates scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseDates.map((courtDate) => (
                      <div key={courtDate.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                          <span className="text-xs text-primary font-medium">
                            {format(new Date(courtDate.date), "MMM")}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {format(new Date(courtDate.date), "d")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{courtDate.purpose}</p>
                          <p className="text-sm text-muted-foreground">
                            {courtDate.courtName} • {courtDate.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
