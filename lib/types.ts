export interface User {
  id: string
  email: string
  name: string
  role: "user" | "lawyer" | "admin"
  createdAt: Date
}

export interface Case {
  id: string
  userId: string
  title: string
  caseNumber?: string
  caseType: CaseType
  status: CaseStatus
  description: string
  opposingParty?: string
  courtName?: string
  nextHearing?: Date
  filingDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type CaseType =
  | "criminal"
  | "civil"
  | "family"
  | "land"
  | "employment"
  | "constitutional"
  | "commercial"
  | "other"

export type CaseStatus =
  | "draft"
  | "active"
  | "pending"
  | "hearing_scheduled"
  | "awaiting_judgment"
  | "won"
  | "lost"
  | "settled"
  | "dismissed"
  | "appealed"

export interface Evidence {
  id: string
  caseId: string
  name: string
  type: EvidenceType
  fileUrl?: string
  description: string
  dateObtained: Date
  source: string
  chainOfCustody: ChainOfCustodyEntry[]
  metadata: Record<string, string>
  createdAt: Date
}

export type EvidenceType =
  | "document"
  | "photo"
  | "video"
  | "audio"
  | "physical"
  | "witness_statement"
  | "expert_report"
  | "other"

export interface ChainOfCustodyEntry {
  id: string
  evidenceId: string
  action: string
  handledBy: string
  timestamp: Date
  notes?: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  caseId?: string
  timestamp: Date
  citations?: LegalCitation[]
}

export interface LegalCitation {
  id: string
  title: string
  source: string
  section?: string
  year?: number
  url?: string
  relevance: string
}

export interface Document {
  id: string
  caseId?: string
  userId: string
  title: string
  type: DocumentType
  content: string
  status: "draft" | "final" | "filed"
  createdAt: Date
  updatedAt: Date
}

export type DocumentType =
  | "affidavit"
  | "motion"
  | "petition"
  | "contract"
  | "letter"
  | "brief"
  | "statement"
  | "notice"
  | "other"

export interface CourtDate {
  id: string
  caseId: string
  date: Date
  time: string
  courtName: string
  courtRoom?: string
  purpose: string
  notes?: string
  reminder: boolean
}

export interface Consultation {
  id: string
  userId: string
  lawyerName: string
  lawyerSpecialization: string
  topic: string
  description: string
  scheduledAt: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  duration: number
  notes: string
}

export interface LegalResource {
  id: string
  title: string
  category: string
  content: string
  source: string
  lastUpdated: Date
}

export interface CallSession {
  id: string
  consultationId: string
  userId: string
  lawyerId: string
  startTime: Date
  endTime?: Date
  duration: number
  recordingUrl?: string
  transcript?: string
  notes: string
  status: "active" | "ended" | "archived"
  metadata: {
    qualityScore?: number
    networkQuality?: "excellent" | "good" | "fair" | "poor"
    messagesCount: number
    documentsSent: number
  }
}
