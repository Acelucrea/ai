"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Scale, Shield, FileText, MessageSquare, Calendar, ChevronRight, CheckCircle, Mic } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Legal Assistant",
    description: "Get instant answers to your legal questions in plain language, powered by Nigerian law expertise.",
  },
  {
    icon: FileText,
    title: "Case Management",
    description: "Track your cases, deadlines, and court dates all in one secure place.",
  },
  {
    icon: Shield,
    title: "Evidence Vault",
    description: "Securely store and organize all your case evidence with full chain of custody tracking.",
  },
  {
    icon: Scale,
    title: "Document Generation",
    description: "Create affidavits, motions, and legal letters with AI-powered templates.",
  },
  {
    icon: Calendar,
    title: "Court Reminders",
    description: "Never miss a court date with smart reminders and calendar integration.",
  },
  {
    icon: Mic,
    title: "Voice Input",
    description: "Speak your legal questions - perfect for busy professionals on the go.",
  },
]

const testimonials = [
  {
    quote: "LegalAide helped me understand my tenant rights when my landlord tried to evict me illegally.",
    author: "Chioma A.",
    location: "Lagos",
  },
  {
    quote: "The case tracking feature saved me from missing a critical court date. Invaluable tool.",
    author: "Emeka O.",
    location: "Abuja",
  },
  {
    quote: "As a small business owner, I now handle basic legal matters confidently.",
    author: "Fatima B.",
    location: "Kano",
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-accent" />
            <span className="font-serif text-xl font-bold text-foreground">LegalAide NG</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
          <Button asChild variant="outline" className="md:hidden bg-transparent" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Trusted by 10,000+ Nigerians
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
              Your AI Legal Companion for Nigerian Law
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 text-pretty">
              Get instant legal guidance, manage your cases, and generate documents - all in plain language you can
              understand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg"
              >
                <Link href="/register">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg bg-transparent">
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                No credit card required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                Nigerian law focused
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-accent" />
                100% secure & private
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Navigate the Law
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From understanding your rights to managing complex cases, LegalAide has you covered.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Nigerians Nationwide
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border border-border">
                <p className="text-foreground leading-relaxed mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-semibold">{testimonial.author[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-balance">
            Ready to Take Control of Your Legal Matters?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerians who are already using LegalAide to understand their rights and manage their
            cases.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 text-lg">
            <Link href="/register">
              Get Started for Free
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-accent" />
              <span className="font-serif font-bold text-foreground">LegalAide NG</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Not a substitute for professional legal advice. Always consult a qualified lawyer for specific cases.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
