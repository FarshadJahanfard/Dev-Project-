"use server"

import { revalidatePath } from "next/cache"

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "rejected" | "pending") {
  try {
    // In a real app, this would update the database
    // For demo purposes, we'll just revalidate the page
    console.log(`Updating booking ${bookingId} to ${status}`)

    revalidatePath("/admin")
    revalidatePath("/admin/bookings")

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}

