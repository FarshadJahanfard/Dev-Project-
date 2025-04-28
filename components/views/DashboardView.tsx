"use client";
import type React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsTable from "@/components/ui/BookingsTable"; 
import type { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define the structure of a booking object
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

interface DashboardViewProps {
  bookings: Booking[];
  onStatusChange: (bookingId: string, newStatus: "CONFIRMED" | "REJECTED" | "PENDING") => Promise<void>;
  formatDate: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement<typeof Badge>;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  onStatusChange,
  formatDate,
  getStatusBadge,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair">Dashboard</h1>
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
            bookings={bookings}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate // Show date on the main dashboard view
          />
        </TabsContent>

        <TabsContent value="PENDING">
          <BookingsTable
            bookings={bookings.filter((booking) => booking.status === "PENDING")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate
          />
        </TabsContent>

        <TabsContent value="CONFIRMED">
          <BookingsTable
            bookings={bookings.filter((booking) => booking.status === "CONFIRMED")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate
          />
        </TabsContent>

        <TabsContent value="REJECTED">
          <BookingsTable
            bookings={bookings.filter((booking) => booking.status === "REJECTED")}
            onStatusChange={onStatusChange}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            showDate
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;