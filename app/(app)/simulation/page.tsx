"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gavel, MessageSquare, Play, RotateCcw, Loader2, CheckCircle2, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { VoiceInputButton } from "@/components/voice-input-button"

interface SimulationMessage {
  role: "judge" | "opposing" | "user" | "feedback"
  content: string
}

export default function SimulationPage() {
  const { cases } = useAppStore()
  const [selectedCase, setSelectedCase] = useState("defaultCase") // Updated default value
  const [scenario, setScenario] = useState<"cross-examination" | "opening" | "objection">("cross-examination")
  const [isRunning, setIsRunning] = useState(false)
  const [messages, setMessages] = useState<SimulationMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const startSimulation = () => {
    setIsRunning(true)
    setMessages([
      {
        role: "judge",
        content: "Court is now in session. Counsel, you may proceed with your cross-examination of the witness.",
      },
      {
        role: "opposing",
        content:
          "Your Honor, I am Mr. Adewale Okonkwo, representing the landlord, ABC Properties Limited. My witness is ready.",
      },
    ])
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setMessages([])
    setUserInput("")
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: userInput }])
    setUserInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses: SimulationMessage[] = [
        {
          role: "feedback",
          content:
            "Good approach. Your question was clear and direct. Consider following up with more specific questions about the timeline.",
        },
        {
          role: "opposing",
          content: "Objection, Your Honor! The question is leading the witness.",
        },
        {
          role: "judge",
          content: "Sustained. Counsel, please rephrase your question.",
        },
      ]

      setMessages((prev) => [...prev, ...responses])
      setIsLoading(false)
    }, 1500)
  }

  const tips = [
    "Maintain eye contact with the judge when making arguments",
    "Stand when addressing the court",
    "Use clear, concise language",
    'Always address the judge as "Your Honor" or "My Lord/Lady"',
    "Do not interrupt when the judge or opposing counsel is speaking",
  ]

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Gavel className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground">Court Prep Simulator</h1>
            <p className="text-sm text-muted-foreground">Practice your courtroom skills</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-6">
        {!isRunning ? (
          <>
            {/* Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Simulation Setup</CardTitle>
                <CardDescription>Configure your practice session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Case (Optional)</label>
                  <Select value={selectedCase} onValueChange={setSelectedCase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a case to practice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defaultCase">General Practice</SelectItem> {/* Updated value prop */}
                      {cases.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Practice Scenario</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { value: "cross-examination", label: "Cross-Examination", desc: "Question witnesses" },
                      { value: "opening", label: "Opening Statement", desc: "Present your case" },
                      { value: "objection", label: "Objections", desc: "Practice objections" },
                    ].map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setScenario(s.value as typeof scenario)}
                        className={cn(
                          "p-4 rounded-lg border text-left transition-colors",
                          scenario === s.value ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                        )}
                      >
                        <p className="font-medium text-sm">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startSimulation}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Simulation
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Courtroom Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Simulation View */}
            <Card className="h-[calc(100vh-16rem)]">
              <CardHeader className="border-b border-border py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Court in Session</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "justify-end",
                        message.role === "feedback" && "justify-center",
                      )}
                    >
                      {message.role === "feedback" ? (
                        <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 max-w-md">
                          <div className="flex items-center gap-2 text-accent mb-1">
                            <Lightbulb className="h-4 w-4" />
                            <span className="text-sm font-medium">AI Feedback</span>
                          </div>
                          <p className="text-sm text-foreground">{message.content}</p>
                        </div>
                      ) : (
                        <>
                          {message.role !== "user" && (
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                message.role === "judge" ? "bg-primary/20" : "bg-muted",
                              )}
                            >
                              {message.role === "judge" ? (
                                <Gavel className="h-4 w-4 text-primary" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                          )}
                          <div
                            className={cn(
                              "rounded-lg p-3 max-w-[80%]",
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : message.role === "judge"
                                  ? "bg-primary/10"
                                  : "bg-muted",
                            )}
                          >
                            <p className="text-xs font-medium mb-1 capitalize">
                              {message.role === "user"
                                ? "You (Counsel)"
                                : message.role === "judge"
                                  ? "Judge"
                                  : "Opposing Counsel"}
                            </p>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Court is responding...</span>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter your statement or question..."
                        className="min-h-[52px] max-h-24 resize-none pr-12"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit()
                          }
                        }}
                      />
                      <VoiceInputButton
                        className="absolute right-2 bottom-2"
                        onTranscriptChange={setUserInput}
                        onFinalTranscript={setUserInput}
                      />
                    </div>
                    <Button onClick={handleSubmit} disabled={!userInput.trim() || isLoading} className="h-[52px] px-6">
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pro tip: Be respectful and address the court properly. Use the microphone to practice your speaking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
