"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Video, StopCircle, Pause, Play } from "lucide-react"

interface CallRecorderProps {
  isActive: boolean
  onRecordingStart?: () => void
  onRecordingStop?: () => string
}

export function CallRecorder({ isActive, onRecordingStart, onRecordingStop }: CallRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement | null
      const stream = canvas?.captureStream?.(30)

      if (stream) {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm;codecs=vp9",
        })

        mediaRecorder.ondataavailable = (event) => {
          chunksRef.current.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" })
          const url = URL.createObjectURL(blob)
          onRecordingStop?.()
        }

        mediaRecorder.start()
        mediaRecorderRef.current = mediaRecorder
        setIsRecording(true)
        onRecordingStart?.()
      }
    } catch (error) {
      console.error("Failed to start recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume?.()
      } else {
        mediaRecorderRef.current.pause?.()
      }
      setIsPaused(!isPaused)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":")
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-red-600">{formatTime(recordingTime)}</span>
        </div>
      )}

      {isActive && !isRecording && (
        <Button size="sm" variant="outline" onClick={startRecording} className="gap-2 bg-transparent">
          <Video className="h-4 w-4" />
          Record
        </Button>
      )}

      {isRecording && (
        <>
          <Button size="sm" variant="outline" onClick={pauseRecording} className="gap-2 bg-transparent">
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="destructive" onClick={stopRecording} className="gap-2">
            <StopCircle className="h-4 w-4" />
            Stop
          </Button>
        </>
      )}
    </div>
  )
}
