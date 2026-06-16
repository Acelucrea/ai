"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, ChevronRight, Calendar, Plus } from "lucide-react"
import { format } from "date-fns"
import type { Case, CaseStatus, CaseType } from "@/lib/types"
import { Button } from "@/components/ui/button"

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

const caseTypeLabels: Record<CaseType, string> = {
  criminal: "Criminal",
  civil: "Civil",
  family: "Family",
  land: "Land/Property",
  employment: "Employment",
  constitutional: "Constitutional",
  commercial: "Commercial",
  other: "Other",
}

interface CaseListProps {
  cases: Case[]
  emptyTitle?: string
  emptyDescription?: string
  showCreateButton?: boolean
}

export function CaseList({
  cases,
  emptyTitle = "No cases found",
  emptyDescription = "Try adjusting your search or filters",
  showCreateButton = false,
}: CaseListProps) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">{emptyTitle}</h3>
        <p className="text-muted-foreground mb-6">{emptyDescription}</p>
        {showCreateButton && (
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Case
            </Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cases.map((caseItem) => (
        <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
          <Card className="hover:border-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-medium text-foreground truncate">{caseItem.title}</h3>
                    <Badge className={statusColors[caseItem.status]}>{caseItem.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {caseTypeLabels[caseItem.caseType]}
                    {caseItem.caseNumber && ` • ${caseItem.caseNumber}`}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{caseItem.description}</p>
                  {caseItem.nextHearing && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-accent">
                      <Calendar className="h-3 w-3" />
                      Next hearing: {format(new Date(caseItem.nextHearing), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
