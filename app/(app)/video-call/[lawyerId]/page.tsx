"use client"
import { useRouter, useParams } from "next/navigation"
import { VideoCallInterface } from "@/components/video-call-interface"
import { useAppStore } from "@/lib/store"

const lawyerProfiles = {
  "lawyer-1": {
    name: "Barrister Chukwu Okonkwo",
    specialty: "Corporate & Commercial Law",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    experience: "15 years",
  },
  "lawyer-2": {
    name: "Barrister Aisha Ibrahim",
    specialty: "Family & Matrimonial Law",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    experience: "12 years",
  },
  "lawyer-3": {
    name: "Barrister Adeyemi Okafor",
    specialty: "Intellectual Property Law",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    experience: "10 years",
  },
}

export default function VideoCallPage() {
  const router = useRouter()
  const params = useParams()
  const lawyerId = params.lawyerId as string
  const { addConsultation } = useAppStore()

  const lawyer = lawyerProfiles[lawyerId as keyof typeof lawyerProfiles]

  if (!lawyer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Lawyer not found</p>
      </div>
    )
  }

  const handleEndCall = () => {
    // Record the consultation
    addConsultation({
      lawyerName: lawyer.name,
      lawyerSpecialty: lawyer.specialty,
      lawyerImage: lawyer.image,
      requestDate: new Date(),
      status: "completed",
    })

    router.push("/consultations")
  }

  return (
    <VideoCallInterface
      lawyerId={lawyerId}
      lawyerName={lawyer.name}
      lawyerSpecialty={lawyer.specialty}
      lawyerImage={lawyer.image}
      onEndCall={handleEndCall}
    />
  )
}
