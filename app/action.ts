"use server"
import { revalidatePath } from "next/cache"
import mysql from "mysql2/promise";
import { makeQuery } from "@/lib/dbUtils";

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "rejected" | "pending") {
  try {
    status = status.toUpperCase() as "confirmed" | "rejected" | "pending";
    console.log(`Updating booking ${bookingId} to ${status}`)

      await makeQuery(
        `UPDATE BOOKINGS SET status = ? WHERE booking_id = '?'`,
        [status, bookingId]
      );

    console.log(`Booking ${bookingId}   updated to ${status}`)

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");

    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false }
  }
}

