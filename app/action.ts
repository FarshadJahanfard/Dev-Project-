"use server"
import { revalidatePath } from "next/cache"
import mysql from "mysql2/promise";


const connectionParams = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ZenFlow",
};

export async function updateBookingStatus(bookingId: string, status: "confirmed" | "rejected" | "pending") {
  try {
    status = status.toUpperCase() as "confirmed" | "rejected" | "pending";
    console.log(`Updating booking ${bookingId} to ${status}`)

      const connection = await mysql.createConnection(connectionParams);

      await connection.query(
        `UPDATE BOOKINGS SET status = ? WHERE booking_id = '?'`,
        [status, bookingId]
      );

    await connection.end();
    console.log(`Booking ${bookingId}   updated to ${status}`)

    revalidatePath("/admin");
    revalidatePath("/admin/bookings");

    return { success: true }
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false }
  }
}

