"use client"

import type React from "react"
import { VoiceInputButton } from "@/components/voice-input-button"
import { useState, useRef, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, Scale, Sparkles, AlertTriangle } from "lucide-react"
import { ChatBubble } from "@/components/chat-interface"

const suggestedQuestions = [
  "What are my rights if my landlord wants to evict me?",
  "How do I file a complaint against my employer?",
  "What is the process for getting a divorce in Nigeria?",
  "How can I protect my intellectual property?",
  "What are the steps to register a business in Nigeria?",
]

const legalResponses: { [key: string]: string } = {
  evict:
    "Under the Tenancy Law in Nigeria, a landlord must provide written notice of at least 3 months before eviction. They must follow proper legal procedures through the court. You have the right to fair warning and cannot be forcibly removed without a court order.",
  complaint:
    "To file a complaint against your employer, you can: 1) Report to your HR department, 2) Contact the Ministry of Labour, 3) File with the National Labour Board, or 4) Seek legal counsel for potential wrongful termination claims.",
  divorce:
    "The divorce process in Nigeria involves: 1) Filing a divorce petition, 2) Serving notice to your spouse, 3) Attempting reconciliation (30-60 days), 4) Court hearings, 5) Granting of decree nisi, 6) Final decree absolute after 6 weeks.",
  "intellectual property":
    "Protect your intellectual property by: 1) Registering copyrights with FIRS, 2) Filing patent applications with NIPRD, 3) Registering trademarks with NIPPON, 4) Using NDAs and licensing agreements.",
  "business registration":
    "To register a business in Nigeria: 1) Choose a business structure (Sole proprietor, Partnership, Limited Company), 2) Register at CAC, 3) Obtain tax ID from FIRS, 4) Open a business bank account, 5) Get necessary permits and licenses.",
}

function getMockResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  for (const [keyword, response] of Object.entries(legalResponses)) {
    if (lowerQuery.includes(keyword)) {
      return response
    }
  }
  return `This is a general legal matter in Nigeria. For specific guidance: 1) Consult with a qualified Nigerian lawyer, 2) Contact the Nigerian Bar Association, 3) Visit your local magistrate court for advice. Please note this is general information, not legal advice.`
}

export default function AssistantPage() {
  const { chatHistory, addMessage } = useAppStore()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const allMessages = [...chatHistory, ...messages]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [allMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    addMessage({
      role: "user",
      content: input,
      citations: [],
    })

    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const responseText = getMockResponse(input)
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
      }
      setMessages((prev) => [...prev, assistantMessage])
      addMessage({
        role: "assistant",
        content: responseText,
        citations: [],
      })
      setIsLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Scale className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">AI Legal Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask me anything about Nigerian law</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
        {allMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-accent" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              I can answer questions about Nigerian law, explain legal concepts, and help you understand your rights.
            </p>
            <div className="w-full max-w-md space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="w-full text-left p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/50 transition-colors text-sm text-foreground"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {allMessages.map((message) => (
              <ChatBubble key={message.id} message={message as any} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Researching Nigerian law...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Disclaimer */}
      <div className="px-4 md:px-6 pb-2">
        <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/50 text-xs text-muted-foreground max-w-3xl mx-auto">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>
            This AI provides general legal information, not legal advice. Always consult a qualified lawyer for specific
            cases.
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-border bg-background">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a legal question..."
                className="min-h-[52px] max-h-32 resize-none pr-12"
                rows={1}
              />
              <VoiceInputButton
                className="absolute right-2 bottom-2"
                onTranscriptChange={setInput}
                onFinalTranscript={setInput}
              />
            </div>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-[52px] px-4 bg-primary hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
