"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, isSameDay } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import BookingsTable from "@/components/ui/BookingsTable";
import type { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


// The structure of a booking object
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

interface BookingsViewProps {
  bookings: Booking[];
  selectedDate: Date;
  onStatusChange: (bookingId: string, newStatus: "CONFIRMED" | "REJECTED" | "PENDING") => Promise<void>;
  formatDate: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement<typeof Badge>;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
  setSelectedDate: (date: Date | undefined) => void;
}

const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  selectedDate,
  onStatusChange,
  formatDate,
  getStatusBadge,
  handlePreviousDay,
  handleNextDay,
  setSelectedDate,
}) => {
  const bookingsForSelectedDate = bookings.filter((booking) =>
    isSameDay(new Date(booking.date), selectedDate)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-playfair">Bookings</h1>
          <p className="text-muted-foreground">Manage restaurant reservations</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousDay}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous day</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] sm:w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {format(selectedDate, "EEEE, MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next day</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <BookingsTable
            bookings={bookingsForSelectedDate}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate={false}
          />
        </TabsContent>

        <TabsContent value="PENDING">
          <BookingsTable
            bookings={bookingsForSelectedDate.filter((b) => b.status === "PENDING")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate={false}
          />
        </TabsContent>

        <TabsContent value="CONFIRMED">
          <BookingsTable
            bookings={bookingsForSelectedDate.filter((b) => b.status === "CONFIRMED")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate={false}
          />
        </TabsContent>

        <TabsContent value="REJECTED">
          <BookingsTable
            bookings={bookingsForSelectedDate.filter((b) => b.status === "REJECTED")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsView;