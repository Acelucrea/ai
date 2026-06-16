"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, Case, Evidence, ChatMessage, Document, CourtDate, Consultation, CallSession } from "./types"

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void

  // Cases
  cases: Case[]
  addCase: (caseData: Omit<Case, "id" | "createdAt" | "updatedAt">) => Case
  updateCase: (id: string, data: Partial<Case>) => void
  deleteCase: (id: string) => void
  getCase: (id: string) => Case | undefined

  // Evidence
  evidence: Evidence[]
  addEvidence: (evidence: Omit<Evidence, "id" | "createdAt">) => Evidence
  updateEvidence: (id: string, data: Partial<Evidence>) => void
  deleteEvidence: (id: string) => void
  getEvidenceByCase: (caseId: string) => Evidence[]

  // Chat
  chatHistory: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  clearChat: () => void

  // Documents
  documents: Document[]
  addDocument: (doc: Omit<Document, "id" | "createdAt" | "updatedAt">) => Document
  updateDocument: (id: string, data: Partial<Document>) => void
  deleteDocument: (id: string) => void

  // Court Dates
  courtDates: CourtDate[]
  addCourtDate: (date: Omit<CourtDate, "id">) => CourtDate
  updateCourtDate: (id: string, data: Partial<CourtDate>) => void
  deleteCourtDate: (id: string) => void

  // Consultations
  consultations: Consultation[]
  addConsultation: (consultation: Omit<Consultation, "userId">) => Consultation
  updateConsultation: (id: string, data: Partial<Consultation>) => void
  deleteConsultation: (id: string) => void
  getConsultation: (id: string) => Consultation | undefined

  // Call Sessions
  callSessions: CallSession[]
  addCallSession: (session: Omit<CallSession, "id" | "startTime">) => CallSession
  updateCallSession: (id: string, data: Partial<CallSession>) => void
  endCallSession: (id: string) => void
  getCallSession: (id: string) => CallSession | undefined
  getCallSessionsByConsultation: (consultationId: string) => CallSession[]
}

const generateId = () => Math.random().toString(36).substring(2, 15)

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Demo login - in production, this would call Supabase
        if (email && password.length >= 6) {
          const user: User = {
            id: generateId(),
            email,
            name: email.split("@")[0],
            role: "user",
            createdAt: new Date(),
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      register: async (email: string, password: string, name: string) => {
        if (email && password.length >= 6 && name) {
          const user: User = {
            id: generateId(),
            email,
            name,
            role: "user",
            createdAt: new Date(),
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      // Cases
      cases: [],

      addCase: (caseData) => {
        const newCase: Case = {
          ...caseData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ cases: [...state.cases, newCase] }))
        return newCase
      },

      updateCase: (id, data) => {
        set((state) => ({
          cases: state.cases.map((c) => (c.id === id ? { ...c, ...data, updatedAt: new Date() } : c)),
        }))
      },

      deleteCase: (id) => {
        set((state) => ({
          cases: state.cases.filter((c) => c.id !== id),
          evidence: state.evidence.filter((e) => e.caseId !== id),
          documents: state.documents.filter((d) => d.caseId !== id),
          courtDates: state.courtDates.filter((cd) => cd.caseId !== id),
          consultations: state.consultations.filter((c) => c.caseId !== id),
          callSessions: state.callSessions.filter((cs) => cs.caseId !== id),
        }))
      },

      getCase: (id) => get().cases.find((c) => c.id === id),

      // Evidence
      evidence: [],

      addEvidence: (evidenceData) => {
        const newEvidence: Evidence = {
          ...evidenceData,
          id: generateId(),
          createdAt: new Date(),
        }
        set((state) => ({ evidence: [...state.evidence, newEvidence] }))
        return newEvidence
      },

      updateEvidence: (id, data) => {
        set((state) => ({
          evidence: state.evidence.map((e) => (e.id === id ? { ...e, ...data } : e)),
        }))
      },

      deleteEvidence: (id) => {
        set((state) => ({
          evidence: state.evidence.filter((e) => e.id !== id),
        }))
      },

      getEvidenceByCase: (caseId) => get().evidence.filter((e) => e.caseId === caseId),

      // Chat
      chatHistory: [],

      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }
        set((state) => ({ chatHistory: [...state.chatHistory, newMessage] }))
      },

      clearChat: () => set({ chatHistory: [] }),

      // Documents
      documents: [],

      addDocument: (docData) => {
        const newDoc: Document = {
          ...docData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ documents: [...state.documents, newDoc] }))
        return newDoc
      },

      updateDocument: (id, data) => {
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...data, updatedAt: new Date() } : d)),
        }))
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }))
      },

      // Court Dates
      courtDates: [],

      addCourtDate: (dateData) => {
        const newDate: CourtDate = {
          ...dateData,
          id: generateId(),
        }
        set((state) => ({ courtDates: [...state.courtDates, newDate] }))
        return newDate
      },

      updateCourtDate: (id, data) => {
        set((state) => ({
          courtDates: state.courtDates.map((cd) => (cd.id === id ? { ...cd, ...data } : cd)),
        }))
      },

      deleteCourtDate: (id) => {
        set((state) => ({
          courtDates: state.courtDates.filter((cd) => cd.id !== id),
        }))
      },

      // Consultations
      consultations: [],

      addConsultation: (consultationData) => {
        const newConsultation: Consultation = {
          ...consultationData,
          userId: get().user?.id || "",
        }
        set((state) => ({ consultations: [...state.consultations, newConsultation] }))
        return newConsultation
      },

      updateConsultation: (id, data) => {
        set((state) => ({
          consultations: state.consultations.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))
      },

      deleteConsultation: (id) => {
        set((state) => ({
          consultations: state.consultations.filter((c) => c.id !== id),
        }))
      },

      getConsultation: (id) => get().consultations.find((c) => c.id === id),

      // Call Sessions
      callSessions: [],

      addCallSession: (sessionData) => {
        const newSession: CallSession = {
          ...sessionData,
          id: generateId(),
          startTime: new Date(),
        }
        set((state) => ({ callSessions: [...state.callSessions, newSession] }))
        return newSession
      },

      updateCallSession: (id, data) => {
        set((state) => ({
          callSessions: state.callSessions.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }))
      },

      endCallSession: (id) => {
        const session = get().callSessions.find((s) => s.id === id)
        if (session && session.endTime) {
          const duration = Math.floor(
            (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000,
          )
          set((state) => ({
            callSessions: state.callSessions.map((s) => (s.id === id ? { ...s, status: "ended", duration } : s)),
          }))
        }
      },

      getCallSession: (id) => get().callSessions.find((s) => s.id === id),

      getCallSessionsByConsultation: (consultationId) =>
        get().callSessions.filter((s) => s.consultationId === consultationId),
    }),
    {
      name: "legalaide-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cases: state.cases,
        evidence: state.evidence,
        chatHistory: state.chatHistory,
        documents: state.documents,
        courtDates: state.courtDates,
        consultations: state.consultations,
        callSessions: state.callSessions,
      }),
    },
  ),
)
