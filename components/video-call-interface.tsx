"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, Video, VideoOff, MessageCircle, Settings } from "lucide-react"

interface VideoCallInterfaceProps {
  lawyerId: string
  lawyerName: string
  lawyerSpecialty: string
  lawyerImage: string
  onEndCall: () => void
}

export function VideoCallInterface({
  lawyerId,
  lawyerName,
  lawyerSpecialty,
  lawyerImage,
  onEndCall,
}: VideoCallInterfaceProps) {
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-slate-900 to-black">
        {/* Lawyer video - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl mx-auto">
            <Image src={lawyerImage || "/placeholder.svg"} alt={lawyerName} fill className="object-cover" priority />
          </div>
        </div>

        {/* Call info overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white text-2xl font-semibold">{lawyerName}</h2>
              <p className="text-teal-400 text-sm">{lawyerSpecialty}</p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-white text-lg font-mono">{formatTime(callDuration)}</p>
            </div>
          </div>
        </div>

        {/* User video thumbnail - bottom right */}
        <div className="absolute bottom-24 right-6 w-32 h-40 rounded-lg overflow-hidden border-2 border-teal-500/50 shadow-lg z-20 bg-slate-800">
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <Video className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-white text-xs">Your Video</p>
              {!isVideoOn && <p className="text-gray-400 text-xs mt-1">Camera Off</p>}
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Connected</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-gradient-to-t from-black to-slate-900/50 border-t border-slate-700 p-6">
        <div className="flex justify-center items-center gap-6 max-w-md mx-auto">
          {/* Microphone toggle */}
          <Button
            onClick={() => setIsMicOn(!isMicOn)}
            variant={isMicOn ? "outline" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title={isMicOn ? "Mute microphone" : "Unmute microphone"}
          >
            {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>

          {/* Video toggle */}
          <Button
            onClick={() => setIsVideoOn(!isVideoOn)}
            variant={isVideoOn ? "outline" : "destructive"}
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title={isVideoOn ? "Turn off camera" : "Turn on camera"}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>

          {/* Chat toggle */}
          <Button
            onClick={() => setShowChat(!showChat)}
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>

          {/* Settings */}
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-transparent"
            title="Settings"
          >
            <Settings className="w-6 h-6" />
          </Button>

          {/* End call */}
          <Button
            onClick={onEndCall}
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Chat sidebar - mobile responsive */}
      {showChat && (
        <div className="fixed bottom-0 right-0 top-0 w-full sm:w-96 bg-slate-950 border-l border-slate-700 shadow-2xl z-30 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Call Notes & Chat</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-300">Chat and notes will appear here during your consultation.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-700">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
