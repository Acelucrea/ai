export interface LawyerProfile {
  id: string
  name: string
  specialty: string
  specialties: string[]
  experience: number
  rating: number
  reviewCount: number
  bio: string
  image: string
  languages: string[]
  responseTime: string
  hourlyRate: number
  availability: {
    weekday: string[]
    weekend: boolean
  }
  verified: boolean
  caseCount: number
  successRate: number
}

export const lawyerProfiles: LawyerProfile[] = [
  {
    id: "lawyer-1",
    name: "Barrister Chukwu Okonkwo",
    specialty: "Corporate & Commercial Law",
    specialties: ["Corporate Law", "Contract Law", "Mergers & Acquisitions", "Business Formation"],
    experience: 15,
    rating: 4.9,
    reviewCount: 127,
    bio: "Senior corporate lawyer with 15 years of experience in mergers, acquisitions, and complex commercial transactions. Specialized in advising multinational corporations and emerging businesses.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English", "Igbo"],
    responseTime: "15 minutes",
    hourlyRate: 150,
    availability: {
      weekday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      weekend: false,
    },
    verified: true,
    caseCount: 234,
    successRate: 92,
  },
  {
    id: "lawyer-2",
    name: "Barrister Aisha Ibrahim",
    specialty: "Family & Matrimonial Law",
    specialties: ["Divorce", "Custody", "Inheritance", "Domestic Relations"],
    experience: 12,
    rating: 4.8,
    reviewCount: 98,
    bio: "Compassionate family law attorney with 12 years of experience in divorce, custody disputes, and inheritance matters. Known for sensitive handling of delicate family matters.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English", "Yoruba"],
    responseTime: "20 minutes",
    hourlyRate: 120,
    availability: {
      weekday: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00"],
      weekend: true,
    },
    verified: true,
    caseCount: 187,
    successRate: 88,
  },
  {
    id: "lawyer-3",
    name: "Barrister Adeyemi Okafor",
    specialty: "Intellectual Property Law",
    specialties: ["Patents", "Trademarks", "Copyright", "Technology Law"],
    experience: 10,
    rating: 4.7,
    reviewCount: 82,
    bio: "Tech-savvy IP lawyer specializing in protecting intellectual property rights for startups and tech companies. Expert in patent prosecution and trademark registration.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English"],
    responseTime: "30 minutes",
    hourlyRate: 140,
    availability: {
      weekday: ["10:00", "11:00", "12:00", "15:00", "16:00"],
      weekend: false,
    },
    verified: true,
    caseCount: 156,
    successRate: 90,
  },
  {
    id: "lawyer-4",
    name: "Barrister Ngozi Eze",
    specialty: "Employment & Labour Law",
    specialties: ["Employment Disputes", "Wrongful Termination", "Workplace Rights", "Contract Negotiation"],
    experience: 11,
    rating: 4.9,
    reviewCount: 115,
    bio: "Employment law specialist protecting workers' rights and employer interests. Experienced in negotiating employment contracts and resolving workplace disputes.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English", "Igbo", "Pidgin"],
    responseTime: "25 minutes",
    hourlyRate: 130,
    availability: {
      weekday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
      weekend: true,
    },
    verified: true,
    caseCount: 201,
    successRate: 91,
  },
  {
    id: "lawyer-5",
    name: "Barrister Tunde Ibrahim",
    specialty: "Real Estate & Property Law",
    specialties: ["Land Disputes", "Property Transfer", "Tenancy Law", "Housing Rights"],
    experience: 14,
    rating: 4.8,
    reviewCount: 108,
    bio: "Property law expert with extensive experience in real estate transactions, land disputes, and housing law. Dedicated to helping clients navigate complex property matters.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English", "Yoruba"],
    responseTime: "20 minutes",
    hourlyRate: 125,
    availability: {
      weekday: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      weekend: false,
    },
    verified: true,
    caseCount: 219,
    successRate: 89,
  },
  {
    id: "lawyer-6",
    name: "Barrister Zainab Hassan",
    specialty: "Criminal Law",
    specialties: ["Criminal Defense", "Bail & Release", "Appeals", "White-Collar Crime"],
    experience: 13,
    rating: 4.7,
    reviewCount: 92,
    bio: "Aggressive criminal defense attorney with 13 years of courtroom experience. Specializes in defending clients against serious criminal charges and appeals.",
    image: "/images/9a4891a4-17ec-4d5b-a929.jpeg",
    languages: ["English", "Hausa"],
    responseTime: "15 minutes",
    hourlyRate: 145,
    availability: {
      weekday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
      weekend: false,
    },
    verified: true,
    caseCount: 178,
    successRate: 87,
  },
]
