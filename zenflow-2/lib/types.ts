export type Booking = {
  id: string
  name: string
  email: string
  date: string
  time: string
  guests: number
  status: "pending" | "confirmed" | "rejected"
  notes?: string
}

