"use client"

import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface VoiceInputButtonProps {
  onTranscriptChange: (text: string) => void
  onFinalTranscript: (text: string) => void
  className?: string
}

export function VoiceInputButton({ onTranscriptChange, onFinalTranscript, className }: VoiceInputButtonProps) {
  const { isListening, transcript, startListening, stopListening, error } = useSpeechRecognition()

  useEffect(() => {
    if (isListening) {
      onTranscriptChange(transcript)
    }
  }, [transcript, isListening, onTranscriptChange])

  const handleToggle = () => {
    if (isListening) {
      stopListening()
      onFinalTranscript(transcript)
    } else {
      startListening()
    }
  }

  if (error && error !== "no-speech") {
    console.warn("[v0] Voice Input Error:", error)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(className, isListening && "text-destructive animate-pulse bg-destructive/10")}
    >
      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  )
}
