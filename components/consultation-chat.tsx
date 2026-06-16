"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2, Copy, Download } from "lucide-react"
import type React from "react"

export interface Message {
  id: string
  role: "user" | "lawyer"
  content: string
  timestamp: Date
}

interface ConsultationChatProps {
  lawyerName: string
  onMessageSent?: (message: Message) => void
  isLoading?: boolean
  initialMessage?: string
}

export function ConsultationChat({
  lawyerName,
  onMessageSent,
  isLoading: externalIsLoading = false,
  initialMessage = "",
}: ConsultationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "lawyer",
      content: `Hello! I'm ${lawyerName}. Welcome to our consultation. I'm here to help you understand your legal options and provide expert guidance. Please feel free to share details about your case. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messageScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight
    }
  }, [messages])

  const classifyQuery = (userInput: string): string => {
    const input = userInput.toLowerCase()
    if (input.includes("contract") || input.includes("agreement")) return "contract"
    if (input.includes("divorce") || input.includes("marriage")) return "family"
    if (input.includes("eviction") || input.includes("tenant")) return "property"
    if (input.includes("employment") || input.includes("fired")) return "employment"
    return "general"
  }

  const getContextualResponse = (category: string): string => {
    const responses: Record<string, string[]> = {
      contract: [
        "For contract disputes, review the exact terms and gather all documentation. I can help draft a formal demand letter.",
        "In Nigerian law, breach of material terms is significant. Document what was promised versus what was delivered.",
      ],
      family: [
        "Divorce proceedings vary by location. Asset division, custody rights, and maintenance are crucial factors.",
        "Have you and your spouse reached agreement on key issues like children and assets?",
      ],
      property: [
        "Eviction cases require proper legal notice and procedure. Check if all requirements were followed.",
        "Document all rent payments and communications. Landlords have maintenance obligations.",
      ],
      employment: [
        "Employment disputes are governed by the Labour Act. Document all incidents and communications.",
        "Gather payslips and employment contracts if you claim unpaid wages.",
      ],
      general: [
        "Based on the details you've shared, let me guide you on the next steps and applicable legal procedures.",
        "Could you provide more specific information about your situation? The more context, the better I can assist.",
      ],
    }
    return responses[category][Math.floor(Math.random() * responses[category].length)]
  }

  const handleSendMessage = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    onMessageSent?.(userMessage)
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const category = classifyQuery(input)
      const lawyerMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "lawyer",
        content: getContextualResponse(category),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, lawyerMessage])
      setIsLoading(false)
    }, 1200)
  }

  const handleCopyMessages = () => {
    const text = messages.map((m) => `${m.role === "user" ? "You" : lawyerName}: ${m.content}`).join("\n\n")
    navigator.clipboard.writeText(text)
  }

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp.toLocaleTimeString()}] ${m.role === "user" ? "You" : lawyerName}: ${m.content}`)
      .join("\n\n")

    const blob = new Blob([transcript], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `consultation-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
        <h3 className="font-semibold text-foreground">Consultation Chat</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopyMessages} title="Copy messages" className="h-8 w-8 p-0">
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadTranscript}
            title="Download transcript"
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" ref={messageScrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "lawyer" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs font-semibold text-primary">L</span>
              </div>
            )}
            <div
              className={`rounded-lg p-3 max-w-[85%] text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              <p>{msg.content}</p>
              <p
                className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">L</span>
            </div>
            <div className="bg-muted rounded-lg p-3 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-muted/30">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or describe your situation..."
            className="min-h-10 resize-none text-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e as React.FormEvent<HTMLTextAreaElement>)
              }
            }}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading || externalIsLoading}
            className="bg-primary hover:bg-primary/90"
            size="icon"
          >
            {isLoading || externalIsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
