"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { ChatMessage } from "@/lib/types"

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <Scale className="h-4 w-4 text-accent" />
        </div>
      )}
      <div className={cn("max-w-[85%] space-y-2", isUser && "order-first")}>
        <Card className={cn("p-4 shadow-sm", isUser ? "bg-primary text-primary-foreground" : "bg-card")}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </Card>

        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Legal References
            </p>
            {message.citations.map((citation) => (
              <Card key={citation.id} className="p-3 bg-muted/50 border-accent/20">
                <p className="text-sm font-medium text-foreground">{citation.title}</p>
                <p className="text-xs text-muted-foreground">
                  {citation.section && `${citation.section} • `}
                  {citation.source} {citation.year && `(${citation.year})`}
                </p>
                <p className="text-xs text-accent mt-1">{citation.relevance}</p>
              </Card>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">{format(new Date(message.timestamp), "h:mm a")}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="text-primary text-sm font-medium">U</span>
        </div>
      )}
    </div>
  )
}
