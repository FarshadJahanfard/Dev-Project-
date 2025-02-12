import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/lib/types"

const recentBookings: Booking[] = [
  {
    id: "1",
    name: "John Smith",
    date: "2024-02-12",
    time: "19:00",
    guests: 4,
    email: "john@example.com",
    status: "pending",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    date: "2024-02-12",
    time: "20:00",
    guests: 2,
    email: "sarah@example.com",
    status: "pending",
  },
  {
    id: "3",
    name: "Michael Brown",
    date: "2024-02-13",
    time: "18:30",
    guests: 6,
    email: "michael@example.com",
    status: "pending",
  },
  {
    id: "4",
    name: "Emily Davis",
    date: "2024-02-13",
    time: "19:30",
    guests: 3,
    email: "emily@example.com",
    status: "pending",
  },
  {
    id: "5",
    name: "David Wilson",
    date: "2024-02-14",
    time: "20:00",
    guests: 2,
    email: "david@example.com",
    status: "pending",
  },
]

export function RecentBookings() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
    }
  }

  return (
    <>
      {/* Mobile view */}
      <div className="grid gap-4 md:hidden">
        {recentBookings.map((booking) => (
          <Card key={booking.id} className="border-secondary/20">
            <CardContent className="grid gap-2 p-4 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">{booking.name}</span>
                <Badge variant="outline" className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{booking.date}</span>
                <span>{booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span>{booking.guests}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.name}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.guests}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

