"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Video, Phone, Settings, Send, Loader2, Mic, MicOff } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { format, isAfter } from "date-fns"
import Image from "next/image"

export default function ConsultationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { consultations = [] } = useAppStore()
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messageScrollRef = useRef<HTMLDivElement>(null)

  const consultation = consultations.find((c) => c.id === params.id)

  useEffect(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight
    }
  }, [messages])

  const classifyQuery = (userInput: string): string => {
    const input = userInput.toLowerCase()
    if (input.includes("contract") || input.includes("agreement")) {
      return "contract dispute"
    } else if (input.includes("divorce") || input.includes("marriage") || input.includes("custody")) {
      return "divorce"
    } else if (input.includes("traffic") || input.includes("ticket") || input.includes("violation")) {
      return "traffic ticket"
    } else if (input.includes("eviction") || input.includes("tenant") || input.includes("landlord")) {
      return "eviction"
    } else if (input.includes("employment") || input.includes("fired") || input.includes("discrimination")) {
      return "employment"
    } else if (input.includes("business") || input.includes("company") || input.includes("registration")) {
      return "business"
    } else if (input.includes("intellectual property") || input.includes("patent") || input.includes("trademark")) {
      return "intellectual property"
    }
    return "general"
  }

  const getContextualResponse = (category: string): string => {
    const responses: Record<string, string[]> = {
      "contract dispute": [
        "For a contract dispute, first review the exact terms and conditions. I can help you draft a formal demand letter. Gather all documentation including the original contract, correspondence, and evidence of breach.",
        "In contract disputes under Nigerian law, breach of material terms is key. Let's document what was promised versus what was delivered. Have you attempted negotiation or mediation?",
        "Common resolution for contracts: negotiation, mediation, arbitration, or court proceedings. What approach would suit your situation best?",
        "Under the Contracts Act, ensure you have clear evidence of the agreement and the breach. This strengthens your position significantly.",
      ],
      divorce: [
        "Divorce proceedings in Nigeria vary based on your location and circumstances. Asset division, custody rights, and maintenance are crucial. Are you considering contested or uncontested divorce?",
        "I recommend consulting local Sharia or customary law as applicable. The grounds for divorce, property rights, and custody arrangements differ. Tell me more about your situation.",
        "For uncontested divorce, proceedings can be faster and less costly. Have you and your spouse reached agreement on key issues like children and assets?",
        "Child custody is determined based on the best interest of the child. Documentation of your relationship with the children is important.",
      ],
      eviction: [
        "Eviction cases require proper notice and legal procedure. Check if the landlord followed the required notice period in your state. Do you have a valid lease agreement?",
        "In Nigeria, eviction must follow proper legal channels. Ensure the landlord complied with notice requirements. I can help you with a response to any eviction notice.",
        "Document all rent payments and communications. If there are repairs needed, document those too. The landlord may have a legal obligation to maintain the property.",
        "Have you consulted the local housing authority? They may provide mediation services before formal court proceedings.",
      ],
      employment: [
        "Employment disputes in Nigeria are governed by the Labour Act. Grounds for wrongful dismissal include violation of due process. Do you have documentation of the termination?",
        "If you faced discrimination, document everything including dates, witnesses, and the nature of discrimination. Nigerian law prohibits workplace discrimination.",
        "Have you reported this through your employer's internal grievance process? That's often required before legal action. What type of employment claim do you have?",
        "Unpaid wages and benefits are serious matters. The Labour Court can order reinstatement or compensation. Gather all payslips and employment contracts.",
      ],
      "traffic ticket": [
        "For traffic tickets, check the citation for errors—incorrect date, time, or vehicle description can be grounds for dismissal. What offense were you cited for?",
        "Your options typically include: pay the fine, contest in court, or attend traffic school. Contesting requires proving the officer's error or your innocence. Do you have evidence?",
        "Gather witnesses or dashboard camera footage if available. Traffic court judges consider mechanical evidence and witness testimony seriously.",
        "Consider negotiating with the prosecutor for reduced charges or fines. Many jurisdictions offer this option.",
      ],
      "intellectual property": [
        "Intellectual property protection includes patents, trademarks, copyrights, and trade secrets. What type of IP are you concerned about?",
        "For trademark issues in Nigeria, register with NIPN (Nigerian Intellectual Property Office). Registering strengthens your legal position significantly.",
        "If your IP is being infringed, document the infringement with dates, URLs, or photographs. We can send a cease-and-desist letter as a first step.",
        "Consider licensing agreements if others want to use your IP. This generates revenue while maintaining control.",
      ],
      business: [
        "Business registration in Nigeria involves CAC (Corporate Affairs Commission) registration. Are you starting a sole proprietorship, partnership, or limited company?",
        "Different business structures have different tax implications and liability protections. A limited company provides liability protection for shareholders.",
        "Ensure your business name is registered and you have all necessary permits and licenses for your industry. Non-compliance can result in hefty fines.",
        "Consider drafting partnership agreements and operating procedures. This prevents disputes among business partners later.",
      ],
      general: [
        "I understand your concern. Let me help you understand your legal options and the applicable laws in Nigeria.",
        "Could you provide more details about your situation? The more context you give, the better legal guidance I can provide.",
        "Nigerian law is comprehensive but varies by state. Tell me about the specific issue you're facing.",
        "Based on what you've shared, I can guide you on next steps and relevant legal procedures.",
      ],
    }
    return (responses[category] || responses.general)[
      Math.floor(Math.random() * (responses[category] || responses.general).length)
    ]
  }

  if (!consultation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Consultation not found</p>
            <Button variant="outline" className="bg-transparent" asChild>
              <Link href="/consultations">Back to Consultations</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isUpcoming = isAfter(new Date(consultation.scheduledAt), new Date())

  const handleStartCall = () => {
    setIsCallActive(true)
    setMessages([
      {
        id: "1",
        role: "lawyer",
        content: `Hello, I'm ${consultation.lawyerName}. Welcome to our consultation about ${consultation.topic}. I'm here to help you understand your legal options. How can I assist you today?`,
      },
    ])
  }

  const handleEndCall = () => {
    setIsCallActive(false)
  }

  const handleSendMessage = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const category = classifyQuery(input)
      const lawyerMessage = {
        id: (Date.now() + 1).toString(),
        role: "lawyer",
        content: getContextualResponse(category),
      }
      setMessages((prev) => [...prev, lawyerMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/consultations">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">{consultation.lawyerName}</h1>
              <p className="text-sm text-muted-foreground">{consultation.lawyerSpecialization}</p>
            </div>
          </div>
          {isCallActive && (
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="bg-transparent" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {!isCallActive && isUpcoming ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Scheduled Consultation</CardTitle>
              <CardDescription>
                {format(new Date(consultation.scheduledAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground mb-2">Topic:</p>
                <p className="text-foreground">{consultation.topic}</p>
              </div>

              {consultation.description && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">Description:</p>
                  <p className="text-foreground">{consultation.description}</p>
                </div>
              )}

              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleStartCall} size="lg">
                <Video className="h-5 w-5 mr-2" />
                Start Video Call
              </Button>
            </CardContent>
          </Card>
        ) : isCallActive ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
            {/* Video Area */}
            <Card className="md:col-span-2 flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Video Consultation</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center rounded-lg relative overflow-hidden">
                  <div className="text-center flex flex-col items-center justify-center">
                    <Image
                      src="/images/9a4891a4-17ec-4d5b-a929.jpeg"
                      alt={consultation.lawyerName}
                      width={300}
                      height={400}
                      className="rounded-lg object-cover shadow-lg mb-4"
                      priority
                    />
                    <p className="text-foreground font-medium text-lg">{consultation.lawyerName}</p>
                    <p className="text-sm text-muted-foreground">{consultation.lawyerSpecialization}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  {/* Timer */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    00:05:23
                  </div>
                </div>

                {/* Call Controls */}
                <div className="p-4 border-t border-border flex gap-2 justify-center">
                  <Button size="icon" variant="outline" className="bg-transparent">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="bg-transparent" onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="outline" className="bg-transparent">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={handleEndCall}>
                    End Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat Sidebar */}
            <Card className="flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-base">Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin" ref={messageScrollRef}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                      <div
                        className={`rounded-lg p-3 max-w-[90%] text-sm ${
                          msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="min-h-10 resize-none text-sm"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e as React.FormEvent<HTMLTextAreaElement>)
                        }
                      }}
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Consultation Summary</CardTitle>
              <CardDescription>{format(new Date(consultation.scheduledAt), "EEEE, MMMM d, yyyy")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground mb-2">Topic:</p>
                <p className="text-foreground">{consultation.topic}</p>
              </div>

              {consultation.description && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">Your Description:</p>
                  <p className="text-foreground">{consultation.description}</p>
                </div>
              )}

              {consultation.notes && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-foreground mb-2">Lawyer's Notes:</p>
                  <p className="text-foreground">{consultation.notes}</p>
                </div>
              )}

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/consultations">Back to Consultations</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
