"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { lawyerProfiles } from "@/lib/lawyers"
import { Star, Search, Clock, DollarSign, CheckCircle, GraduationCap } from "lucide-react"

export default function LawyersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")

  const filteredLawyers = lawyerProfiles.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty = !selectedSpecialty || lawyer.specialties.includes(selectedSpecialty)

    return matchesSearch && matchesSpecialty
  })

  const allSpecialties = Array.from(new Set(lawyerProfiles.flatMap((l) => l.specialties)))

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Lawyer Directory</h1>
            <p className="text-sm text-muted-foreground">Browse verified AI legal professionals</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {/* Specialty Filter */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Filter by Specialty</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedSpecialty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty("")}
              className="bg-transparent"
            >
              All
            </Button>
            {allSpecialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                className="bg-transparent"
              >
                {specialty}
              </Button>
            ))}
          </div>
        </div>

        {/* Lawyer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLawyers.map((lawyer) => (
            <Card
              key={lawyer.id}
              className="hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden flex flex-col"
            >
              {/* Header with image */}
              <div className="relative h-32 bg-gradient-to-br from-slate-200 to-slate-300">
                <Image src={lawyer.image || "/placeholder.svg"} alt={lawyer.name} fill className="object-cover" />
                {lawyer.verified && (
                  <div className="absolute top-2 right-2 bg-green-500/90 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              <CardContent className="flex-1 p-4 flex flex-col">
                {/* Name and Primary Specialty */}
                <h3 className="font-semibold text-foreground mb-1">{lawyer.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{lawyer.specialty}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(lawyer.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{lawyer.rating}</span>
                  <span className="text-xs text-muted-foreground">({lawyer.reviewCount})</span>
                </div>

                {/* Experience and Stats */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Experience:</span>
                    <span className="font-medium text-foreground">{lawyer.experience} years</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Success Rate:</span>
                    <span className="font-medium text-green-600">{lawyer.successRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Cases:</span>
                    <span className="font-medium text-foreground">{lawyer.caseCount}</span>
                  </div>
                </div>

                {/* Pricing and Response Time */}
                <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground font-medium">${lawyer.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs">{lawyer.responseTime}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.languages.map((lang) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Button variant="outline" className="text-xs h-8 bg-transparent">
                    View Profile
                  </Button>
                  <Button className="text-xs h-8 bg-primary hover:bg-primary/90" asChild>
                    <Link href={`/consultations/new?lawyer=${lawyer.id}`}>Consult</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredLawyers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No lawyers found matching your criteria</p>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedSpecialty("")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
