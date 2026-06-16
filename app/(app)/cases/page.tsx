"use client"

import { useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { CaseList } from "@/components/case-list"

export default function CasesPage() {
  const { cases } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    const matchesType = typeFilter === "all" || c.caseType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">My Cases</h1>
            <p className="text-muted-foreground text-sm">
              {cases.length} case{cases.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/cases/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Case</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="hearing_scheduled">Hearing</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="land">Land/Property</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="constitutional">Constitutional</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6">
        <CaseList
          cases={filteredCases}
          emptyTitle={cases.length === 0 ? "No cases yet" : "No matching cases"}
          emptyDescription={
            cases.length === 0
              ? "Create your first case to start tracking your legal matters"
              : "Try adjusting your search or filters"
          }
          showCreateButton={cases.length === 0}
        />
      </div>
    </div>
  )
}
