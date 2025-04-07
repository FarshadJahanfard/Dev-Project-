"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateBookingStatus } from "@/app/action"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import type { Booking } from "@/lib/types"

const bookings: Booking[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    date: "2024-02-12",
    time: "19:00",
    guests: 4,
    status: "pending",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    date: "2024-02-12",
    time: "20:00",
    guests: 2,
    status: "pending",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    date: "2024-02-13",
    time: "18:30",
    guests: 6,
    status: "pending",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    date: "2024-02-13",
    time: "19:30",
    guests: 3,
    status: "pending",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    date: "2024-02-14",
    time: "20:00",
    guests: 2,
    status: "pending",
  },
]

export function BookingsTable() {
  const { toast } = useToast()
  const [localBookings, setLocalBookings] = useState(bookings)
  const [processing, setProcessing] = useState<string | null>(null)

  async function handleStatusUpdate(bookingId: string, newStatus: "confirmed" | "rejected") {
    setProcessing(bookingId)
    try {
      const result = await updateBookingStatus(bookingId, newStatus)

      if (result.success) {
        // Update local state for immediate UI feedback
        setLocalBookings((prev) =>
          prev.map((booking) => (booking.id === bookingId ? { ...booking, status: newStatus } : booking)),
        )

        toast({
          title: "Status Updated",
          description: `Booking ${newStatus} successfully`,
        })
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    } finally {
      setProcessing(null)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700"
      case "rejected":
        return "bg-red-50 text-red-700"
      default:
        return "bg-yellow-50 text-yellow-700"
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile view - cards */}
      <div className="grid gap-4 md:hidden">
        {localBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="text-base">{booking.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{booking.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span>{booking.guests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
                    booking.status,
                  )}`}
                >
                  {booking.status}
                </span>
              </div>
              {booking.status === "pending" && (
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-700"
                    onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                    disabled={processing === booking.id}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-700"
                    onClick={() => handleStatusUpdate(booking.id, "rejected")}
                    disabled={processing === booking.id}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view - table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.guests}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-700"
                        onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                        disabled={processing === booking.id}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-700"
                        onClick={() => handleStatusUpdate(booking.id, "rejected")}
                        disabled={processing === booking.id}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

