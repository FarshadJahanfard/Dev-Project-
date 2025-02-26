"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Check,
  X,
  ArrowLeft,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  Clock,
  Utensils,
  Settings,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, addDays, subDays, isSameDay, parseISO } from "date-fns"
import Link from "next/link"
import { updateBookingStatus } from "../actions"
import { useToast } from "@/components/ui/use-toast"

// Mock data for bookings
const mockBookings = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    date: "2025-02-26",
    time: "19:30",
    guests: 4,
    notes: "Window seat preferred",
    status: "pending",
    table: "T1",
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma@example.com",
    date: "2025-02-27",
    time: "20:30",
    guests: 2,
    notes: "Anniversary celebration",
    status: "confirmed",
    table: "T2",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    date: "2025-02-27",
    time: "18:30",
    guests: 6,
    notes: "Gluten-free options needed for two guests",
    status: "pending",
    table: "T3",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    date: "2025-02-28",
    time: "12:30",
    guests: 3,
    notes: "",
    status: "rejected",
    table: "T4",
  },
  {
    id: "5",
    name: "David Lee",
    email: "david@example.com",
    date: "2025-02-28",
    time: "13:30",
    guests: 2,
    notes: "Vegetarian options needed",
    status: "pending",
    table: "T5",
  },
  {
    id: "6",
    name: "Lisa Chen",
    email: "lisa@example.com",
    date: "2025-02-26",
    time: "18:00",
    guests: 4,
    notes: "Birthday celebration",
    status: "confirmed",
    table: "T1",
  },
  {
    id: "7",
    name: "Robert Taylor",
    email: "robert@example.com",
    date: "2025-02-26",
    time: "19:00",
    guests: 2,
    notes: "",
    status: "confirmed",
    table: "T1",
  },
  {
    id: "8",
    name: "Jennifer Adams",
    email: "jennifer@example.com",
    date: "2025-02-26",
    time: "20:00",
    guests: 5,
    notes: "Allergy to nuts",
    status: "confirmed",
    table: "T8",
  },
  {
    id: "9",
    name: "Thomas Wilson",
    email: "thomas@example.com",
    date: "2025-02-26",
    time: "18:30",
    guests: 3,
    notes: "",
    status: "confirmed",
    table: "T9",
  },
  {
    id: "10",
    name: "Maria Garcia",
    email: "maria@example.com",
    date: "2025-02-26",
    time: "19:15",
    guests: 2,
    notes: "Anniversary",
    status: "confirmed",
    table: "T10",
  },
]

type ViewType = "dashboard" | "bookings" | "timeSlots" | "popularTimes" | "tableUsage" | "settings"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [bookings, setBookings] = useState(
    [...mockBookings].sort((a, b) => {
      const [aHour, aMinute] = a.time.split(":").map(Number)
      const [bHour, bMinute] = b.time.split(":").map(Number)

      const aDate = new Date(a.date)
      const bDate = new Date(b.date)

      aDate.setHours(aHour, aMinute, 0)
      bDate.setHours(bHour, bMinute, 0)

      return aDate.getTime() - bDate.getTime()
    }),
  )
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "admin" && password === "password") {
      setIsAuthenticated(true)
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      })
    } else {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (bookingId: string, newStatus: "confirmed" | "rejected" | "pending") => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus)

      if (result.success) {
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking,
        )

        const sortedBookings = [...updatedBookings].sort((a, b) => {
          const [aHour, aMinute] = a.time.split(":").map(Number)
          const [bHour, bMinute] = b.time.split(":").map(Number)

          const aDate = new Date(a.date)
          const bDate = new Date(b.date)

          aDate.setHours(aHour, aMinute, 0)
          bDate.setHours(bHour, bMinute, 0)

          return aDate.getTime() - bDate.getTime()
        })

        setBookings(sortedBookings)

        toast({
          title: "Status updated",
          description: `Booking #${bookingId} has been ${newStatus}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
      default:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
    }
  }

  const handlePreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1))
  }

  const handleNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1))
  }

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 10 // 10 AM
    const endHour = 22 // 10 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        const bookingsInSlot = bookings.filter((booking) => {
          if (!isSameDay(parseISO(booking.date), selectedDate)) return false

          const [bookingHour, bookingMinute] = booking.time.split(":").map(Number)
          return bookingHour === hour && bookingMinute >= minute && bookingMinute < minute + 15
        })

        slots.push({
          time,
          count: bookingsInSlot.length,
          guests: bookingsInSlot.reduce((sum, booking) => sum + booking.guests, 0),
        })
      }
    }

    return slots
  }

  // Generate data for popular times chart
  const generatePopularTimesData = () => {
    const hourCounts = Array(24).fill(0)
    const hourGuests = Array(24).fill(0)

    bookings.forEach((booking) => {
      const [hour] = booking.time.split(":").map(Number)
      hourCounts[hour]++
      hourGuests[hour] += booking.guests
    })

    return hourCounts.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, "0")}:00`,
      count,
      guests: hourGuests[hour],
    }))
  }

  // Generate data for table usage
  const generateTableUsageData = () => {
    const tables = {}

    bookings.forEach((booking) => {
      if (!tables[booking.table]) {
        tables[booking.table] = {
          confirmed: 0,
          pending: 0,
          rejected: 0,
          total: 0,
        }
      }

      tables[booking.table][booking.status]++
      tables[booking.table].total++
    })

    return Object.entries(tables)
      .map(([table, data]) => ({
        table,
        ...(data as any),
      }))
      .sort((a, b) => a.table.localeCompare(b.table))
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
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
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
              For demo purposes, use username: <span className="font-semibold">admin</span> and password:{" "}
              <span className="font-semibold">password</span>
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-playfair font-bold">
              ZenFlow
            </Link>
            <span className="text-sm bg-secondary/20 px-2 py-0.5 rounded">Admin</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsAuthenticated(false)}
            className="text-primary-foreground hover:text-primary-foreground/80"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-card border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Management</h2>
            <nav className="space-y-2">
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
            </nav>

            <h2 className="text-lg font-semibold mt-6 mb-4">Analytics</h2>
            <nav className="space-y-2">
              <Button
                variant={currentView === "timeSlots" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentView("timeSlots")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Time Slots
              </Button>
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

            <h2 className="text-lg font-semibold mt-6 mb-4">System</h2>
            <nav className="space-y-2">
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-playfair">Dashboard</h1>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <BookingsTable
                    bookings={bookings}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    showDate
                  />
                </TabsContent>

                <TabsContent value="pending">
                  <BookingsTable
                    bookings={bookings.filter((booking) => booking.status === "pending")}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    showDate
                  />
                </TabsContent>

                <TabsContent value="confirmed">
                  <BookingsTable
                    bookings={bookings.filter((booking) => booking.status === "confirmed")}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    showDate
                  />
                </TabsContent>

                <TabsContent value="rejected">
                  <BookingsTable
                    bookings={bookings.filter((booking) => booking.status === "rejected")}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                    showDate
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentView === "bookings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-playfair">Bookings</h1>
                  <p className="text-muted-foreground">Manage restaurant reservations</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous day</span>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
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
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <BookingsTable
                    bookings={bookings.filter((booking) => isSameDay(new Date(booking.date), selectedDate))}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                  />
                </TabsContent>

                <TabsContent value="pending">
                  <BookingsTable
                    bookings={bookings.filter(
                      (booking) => booking.status === "pending" && isSameDay(new Date(booking.date), selectedDate),
                    )}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                  />
                </TabsContent>

                <TabsContent value="confirmed">
                  <BookingsTable
                    bookings={bookings.filter(
                      (booking) => booking.status === "confirmed" && isSameDay(new Date(booking.date), selectedDate),
                    )}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                  />
                </TabsContent>

                <TabsContent value="rejected">
                  <BookingsTable
                    bookings={bookings.filter(
                      (booking) => booking.status === "rejected" && isSameDay(new Date(booking.date), selectedDate),
                    )}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    getStatusBadge={getStatusBadge}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentView === "timeSlots" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-playfair">Time Slots Analysis</h1>
                  <p className="text-muted-foreground">Customer distribution by 15-minute intervals</p>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous day</span>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
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

              <Card>
                <CardHeader>
                  <CardTitle>Bookings by 15-Minute Slots</CardTitle>
                  <CardDescription>
                    Visualize customer distribution throughout the day in 15-minute intervals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time Slot</TableHead>
                          <TableHead className="text-center">Bookings</TableHead>
                          <TableHead className="text-center">Total Guests</TableHead>
                          <TableHead>Visualization</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateTimeSlots().map((slot) => (
                          <TableRow key={slot.time}>
                            <TableCell className="font-medium">{slot.time}</TableCell>
                            <TableCell className="text-center">{slot.count}</TableCell>
                            <TableCell className="text-center">{slot.guests}</TableCell>
                            <TableCell>
                              <div className="w-full bg-muted rounded-full h-4">
                                <div
                                  className="bg-secondary h-4 rounded-full"
                                  style={{ width: `${Math.min(100, slot.count * 20)}%` }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "popularTimes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-playfair">Popular Times</h1>
                  <p className="text-muted-foreground">Analyze peak booking hours</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Hour</CardTitle>
                  <CardDescription>Visualize the most popular booking hours across all dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end gap-2">
                    {generatePopularTimesData()
                      .filter((data) => data.count > 0)
                      .map((data) => (
                        <div key={data.hour} className="flex flex-col items-center flex-1">
                          <div
                            className="bg-secondary w-full rounded-t-md"
                            style={{ height: `${Math.max(5, data.count * 30)}px` }}
                          ></div>
                          <div className="text-xs mt-2 text-center">{data.hour}</div>
                          <div className="text-xs text-muted-foreground">{data.count} bookings</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Count by Hour</CardTitle>
                  <CardDescription>Total number of guests during each hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end gap-2">
                    {generatePopularTimesData()
                      .filter((data) => data.guests > 0)
                      .map((data) => (
                        <div key={data.hour} className="flex flex-col items-center flex-1">
                          <div
                            className="bg-primary w-full rounded-t-md"
                            style={{ height: `${Math.max(5, data.guests * 10)}px` }}
                          ></div>
                          <div className="text-xs mt-2 text-center">{data.hour}</div>
                          <div className="text-xs text-muted-foreground">{data.guests} guests</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "tableUsage" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-playfair">Table Usage</h1>
                  <p className="text-muted-foreground">Analyze table utilization and booking status</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Table Booking Distribution</CardTitle>
                  <CardDescription>Overview of bookings by table and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Table</TableHead>
                          <TableHead className="text-center">Confirmed</TableHead>
                          <TableHead className="text-center">Pending</TableHead>
                          <TableHead className="text-center">Rejected</TableHead>
                          <TableHead className="text-center">Total</TableHead>
                          <TableHead>Usage Distribution</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateTableUsageData().map((table) => (
                          <TableRow key={table.table}>
                            <TableCell className="font-medium">{table.table}</TableCell>
                            <TableCell className="text-center">{table.confirmed}</TableCell>
                            <TableCell className="text-center">{table.pending}</TableCell>
                            <TableCell className="text-center">{table.rejected}</TableCell>
                            <TableCell className="text-center">{table.total}</TableCell>
                            <TableCell>
                              <div className="flex h-4 w-full overflow-hidden rounded-full">
                                {table.confirmed > 0 && (
                                  <div
                                    className="bg-green-500 h-full"
                                    style={{ width: `${(table.confirmed / table.total) * 100}%` }}
                                  ></div>
                                )}
                                {table.pending > 0 && (
                                  <div
                                    className="bg-yellow-500 h-full"
                                    style={{ width: `${(table.pending / table.total) * 100}%` }}
                                  ></div>
                                )}
                                {table.rejected > 0 && (
                                  <div
                                    className="bg-red-500 h-full"
                                    style={{ width: `${(table.rejected / table.total) * 100}%` }}
                                  ></div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Most Used Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {generateTableUsageData().sort((a, b) => b.total - a.total)[0]?.table || "N/A"}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {generateTableUsageData().sort((a, b) => b.total - a.total)[0]?.total || 0} bookings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Least Used Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {generateTableUsageData().sort((a, b) => a.total - b.total)[0]?.table || "N/A"}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {generateTableUsageData().sort((a, b) => a.total - b.total)[0]?.total || 0} bookings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Average Bookings per Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {(bookings.length / generateTableUsageData().length).toFixed(1)}
                    </div>
                    <p className="text-muted-foreground text-sm">Across {generateTableUsageData().length} tables</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentView === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-playfair">Settings</h1>
                  <p className="text-muted-foreground">Configure system preferences</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Manage your restaurant system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input id="restaurant-name" defaultValue="Capri at the dam" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="opening-time">Opening Time</Label>
                    <Input id="opening-time" defaultValue="10:30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closing-time">Closing Time</Label>
                    <Input id="closing-time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-interval">Booking Interval (minutes)</Label>
                    <Input id="booking-interval" type="number" defaultValue="15" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-secondary hover:bg-secondary/90 text-primary">Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

interface BookingsTableProps {
  bookings: any[]
  onStatusChange: (id: string, status: "confirmed" | "rejected" | "pending") => void
  formatDate: (date: string) => string
  getStatusBadge: (status: string) => React.JSX.Element
  showDate?: boolean
}

function BookingsTable({ bookings, onStatusChange, formatDate, getStatusBadge, showDate = false }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-sm text-muted-foreground">Try selecting a different date or status filter.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table</TableHead>
            <TableHead>Status</TableHead>
            {showDate && <TableHead>Date</TableHead>}
            <TableHead>Time</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Guests</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.table}</TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              {showDate && <TableCell>{formatDate(booking.date)}</TableCell>}
              <TableCell>{booking.time}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell className="text-muted-foreground">{booking.email}</TableCell>
              <TableCell className="text-center">{booking.guests}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={booking.notes}>
                {booking.notes || "-"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {booking.status !== "confirmed" && (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => onStatusChange(booking.id, "confirmed")}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirm
                      </DropdownMenuItem>
                    )}
                    {booking.status !== "rejected" && (
                      <DropdownMenuItem className="text-red-600" onClick={() => onStatusChange(booking.id, "rejected")}>
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </DropdownMenuItem>
                    )}
                    {(booking.status === "confirmed" || booking.status === "rejected") && (
                      <DropdownMenuItem onClick={() => onStatusChange(booking.id, "pending")}>
                        Reset to Pending
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

