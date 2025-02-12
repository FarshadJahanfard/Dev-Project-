import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentBookings } from "@/components/recent-bookings"
import { CalendarDays, Users, UtensilsCrossed } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your restaurant management dashboard</p>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              20.1% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">873</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              10.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Table Capacity</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 mr-1">↑</span>
              2.5% from last month
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="border-secondary/20 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-playfair">Booking Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="border-secondary/20 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-playfair">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentBookings />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

