"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, addDays, subDays, isSameDay } from "date-fns";
import Link from "next/link";
import { updateBookingStatus } from "../action"; 
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
import { useRouter } from 'next/navigation'
import Draggable from 'react-draggable'


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

type ViewType = "dashboard" | "bookings" | "Add Table" | "popularTimes" | "tableUsage" | "settings" | "floorPlan";

export default function Dashboard({ nBookings }: { nBookings: Booking[] }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [bookings, setBookings] = useState<Booking[]>(
    [...nBookings].sort((a, b) => {
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
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: "CONFIRMED" | "REJECTED" | "PENDING") => {
    try {
      console.log("Handle status change for booking:", bookingId, "to status:", newStatus);
      const result: { success: boolean; error?: string } = await updateBookingStatus(bookingId, newStatus.toLowerCase() as "confirmed" | "rejected" | "pending");

      if (result.success) {
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        );

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
         const offset = date.getTimezoneOffset() * 60000;
         const localDate = new Date(date.getTime() + offset);
        return localDate.toLocaleDateString("en-GB", {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Back to Website
              </Link>
            </div>
            <CardTitle className="text-2xl font-playfair text-center mt-4">ZenFlow Admin</CardTitle>
            <CardDescription className="text-center">Login to manage reservations</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                Login
              </Button>
            </CardFooter>
          </form>
          <div className="px-6 pb-6">
            <p className="text-xs text-center text-muted-foreground mt-4">
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-playfair font-bold">
              ZenFlow
            </Link>
            <span className="text-xs sm:text-sm bg-secondary/20 px-2 py-0.5 rounded">Admin</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsAuthenticated(false)}
            className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
          >
            Logout
          </Button> 
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-card border-r fixed top-[64px] left-0 h-full">
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
               <Button
                variant={currentView === "floorPlan" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setCurrentView("floorPlan")   
                  router.push("/admin/floor-plan") 
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Floor Plan
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
                Bookings Analytics 
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

         <main className="flex-1 p-6 sm:p-8 ml-64 mt-[64px]">
          {currentView === "dashboard" && (
            <DashboardView
              bookings={bookings}
              onStatusChange={handleStatusChange}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          )}

          {currentView === "bookings" && selectedDate && (
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
            <AddTableView />
          )}

          {currentView === "popularTimes" && (
            <PopularTimesView bookings={bookings} />
          )}

          {currentView === "tableUsage" && (
            <TableUsageView bookings={bookings} />
          )}

          {currentView === "settings" && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}