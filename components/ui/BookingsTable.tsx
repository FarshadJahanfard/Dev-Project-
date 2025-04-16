"use client";
import type React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Clock } from "lucide-react";
import type { Badge } from "@/components/ui/badge"; // Assuming Badge is exported type
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define the shape of a booking object
interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  table: string;
}

// Define the props for the BookingsTable component
interface BookingsTableProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: "CONFIRMED" | "REJECTED" | "PENDING") => Promise<void>;
  formatDate: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement<typeof Badge>;
  showDate?: boolean; // Optional prop to show/hide the date column
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onStatusChange,
  formatDate,
  getStatusBadge,
  showDate = false, // Default to false if not provided
}) => {
  if (!bookings || bookings.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No bookings found.</p>;
  }

  return (
    <Card>
      <CardContent className="p-0"> 
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {showDate && <TableHead>Date</TableHead>}
                <TableHead>Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  {showDate && <TableCell>{formatDate(booking.date)}</TableCell>}
                  <TableCell>{booking.time}</TableCell>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>{booking.table}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={booking.notes}>
                    {booking.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {booking.status !== "CONFIRMED" && (
                          <DropdownMenuItem onClick={() => onStatusChange(booking.id, "CONFIRMED")}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "REJECTED" && (
                          <DropdownMenuItem onClick={() => onStatusChange(booking.id, "REJECTED")}>
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {booking.status !== "PENDING" && (
                          <DropdownMenuItem onClick={() => onStatusChange(booking.id, "PENDING")}>
                            <Clock className="mr-2 h-4 w-4 text-yellow-600" />
                             Mark as Pending
                          </DropdownMenuItem>
                        )}
                         {/* Add more actions if needed, e.g., Edit, Delete */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsTable;