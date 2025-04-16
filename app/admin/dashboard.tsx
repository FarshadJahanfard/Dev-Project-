"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, subDays, isSameDay } from "date-fns";
import Link from "next/link";
import { updateBookingStatus } from "../action"; // Adjust path as needed
import { useToast } from "@/components/ui/use-toast";
import {
  Check, 
  X,
  ArrowLeft, 
  Calendar, 
  LayoutDashboard, 
  BarChart3, 
  Utensils,
  Plus, 
  Settings,
  Clock, 
} from "lucide-react";


import DashboardView from "@/components/views/DashboardView";
import BookingsView from "@/components/views/BookingsView";
import AddTableView from "@/components/views/AddTableView";
import PopularTimesView from "@/components/views/PopularTimesView";
import TableUsageView from "@/components/views/TableUsageView";
import SettingsView from "@/components/views/SettingsView";


// Define the shape of a booking object (keep here for state typing)
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


// Define the types for the views
type ViewType = "dashboard" | "bookings" | "Add Table" | "popularTimes" | "tableUsage" | "settings";

// Main Dashboard Component
export default function Dashboard({ mockBookings }: { mockBookings: Booking[] }) { // Use the Booking type
  // --- State variables remain the same ---
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume logged in for now, remove login logic or keep as is
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>( // Use the Booking type
    [...mockBookings].sort((a, b) => {
      // Sort logic remains the same
      const [aHour, aMinute] = a.time.split(":").map(Number);
      const [bHour, bMinute] = b.time.split(":").map(Number);
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      aDate.setHours(aHour, aMinute, 0);
      bDate.setHours(bHour, bMinute, 0);
      return aDate.getTime() - bDate.getTime();
    }),
  );
  const { toast } = useToast();

  // --- Handlers remain the same ---
  // handleLogin logic... (keep or remove based on auth flow)

  const handleStatusChange = async (bookingId: string, newStatus: "CONFIRMED" | "REJECTED" | "PENDING") => {
    try {
      console.log("Handle status change for booking:", bookingId, "to status:", newStatus);
      const result = await updateBookingStatus(bookingId, newStatus);

      if (result.success) {
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        );

        // Re-sort after status change
        const sortedBookings = [...updatedBookings].sort((a, b) => {
             const [aHour, aMinute] = a.time.split(":").map(Number);
             const [bHour, bMinute] = b.time.split(":").map(Number);
             const aDate = new Date(a.date);
             const bDate = new Date(b.date);
             aDate.setHours(aHour, aMinute, 0);
             bDate.setHours(bHour, bMinute, 0);
             return aDate.getTime() - bDate.getTime();
        });

        setBookings(sortedBookings);

        toast({
          title: "Status updated",
          description: `Booking #${bookingId} status changed to ${newStatus}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update booking status",
          variant: "destructive",
        });
      }
    } catch (error) {
        console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
        const date = new Date(dateStr);
         // Add time zone offset to treat date string as local
         const offset = date.getTimezoneOffset() * 60000;
         const localDate = new Date(date.getTime() + offset);
        return localDate.toLocaleDateString("en-GB", { // Use en-GB for DD/MM/YYYY or en-US for MM/DD/YYYY
          // weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
    } catch (e) {
        console.error("Error formatting date:", dateStr, e);
        return "Invalid Date";
    }
  };


  const getStatusBadge = (status: string): React.ReactElement<typeof Badge> => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">Rejected</Badge>;
      case "PENDING":
      default:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        );
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate((prev) => prev ? subDays(prev, 1) : new Date());
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => prev ? addDays(prev, 1) : new Date());
  };

  const handleSetSelectedDate = (date: Date | undefined) => {
      setSelectedDate(date);
  }

  // --- Remove generatePopularTimesData and generateTableUsageData (moved to views) ---

   // Login rendering logic (keep or remove based on auth flow)
   if (!isAuthenticated) {
     // return ( ... login JSX ... );
     // For now, let's skip the login screen to focus on the main layout
   }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-muted/40"> {/* Adjusted background */}
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-playfair font-bold">
              ZenFlow
            </Link>
            <span className="text-xs sm:text-sm bg-secondary/20 px-2 py-0.5 rounded">Admin</span>
          </div>
          {/* Add logout logic if needed */}
          {/* <Button
            variant="ghost"
            onClick={() => setIsAuthenticated(false)}
            className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
          >
            Logout
          </Button> */}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-card border-r fixed top-[64px] left-0 h-full"> {/* Fixed position sidebar */}
          <div className="p-4">
             <h2 className="text-lg font-semibold mb-4 px-2">Management</h2>
             <nav className="space-y-1">
              <Button
                variant={currentView === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("dashboard")}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={currentView === "bookings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("bookings")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Bookings
              </Button>
               <Button
                   variant={currentView === "Add Table" ? "secondary" : "ghost"}
                   className="w-full justify-start"
                   onClick={() => setCurrentView("Add Table")}
               >
                   <Plus className="mr-2 h-4 w-4" />
                   Add Table
               </Button>
            </nav>

             <h2 className="text-lg font-semibold mt-6 mb-4 px-2">Analytics</h2>
             <nav className="space-y-1">
              <Button
                variant={currentView === "popularTimes" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("popularTimes")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Popular Times
              </Button>
              <Button
                variant={currentView === "tableUsage" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("tableUsage")}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Table Usage
              </Button>
            </nav>

             <h2 className="text-lg font-semibold mt-6 mb-4 px-2">System</h2>
             <nav className="space-y-1">
              <Button
                variant={currentView === "settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
         <main className="flex-1 p-6 sm:p-8 ml-64 mt-[64px]"> {/* Add margin-left to offset fixed sidebar */}
          {/* --- Conditional Rendering of Views --- */}
          {currentView === "dashboard" && (
            <DashboardView
              bookings={bookings}
              onStatusChange={handleStatusChange}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          )}

          {currentView === "bookings" && selectedDate && ( // Ensure selectedDate is not undefined
            <BookingsView
               bookings={bookings}
               selectedDate={selectedDate}
               onStatusChange={handleStatusChange}
               formatDate={formatDate}
               getStatusBadge={getStatusBadge}
               handlePreviousDay={handlePreviousDay}
               handleNextDay={handleNextDay}
               setSelectedDate={handleSetSelectedDate}
            />
          )}

          {currentView === "Add Table" && (
            <AddTableView /> // Pass props if AddTableView needs them later
          )}

          {currentView === "popularTimes" && (
            <PopularTimesView bookings={bookings} />
          )}

          {currentView === "tableUsage" && (
            <TableUsageView bookings={bookings} />
          )}

          {currentView === "settings" && (
            <SettingsView /> // Pass props if SettingsView needs them later
          )}
        </main>
      </div>
    </div>
  );
}