"use client";
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


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

interface PopularTimesViewProps {
  bookings: Booking[];
}

const PopularTimesView: React.FC<PopularTimesViewProps> = ({ bookings }) => {
  // Logic to generate popular times data
  const generatePopularTimesData = () => {
    const hourCounts = Array(24).fill(0);
    const hourGuests = Array(24).fill(0);
    console.log('PopularTimesView - Bookings received:', bookings);

    bookings.forEach((booking) => {
      // Only count confirmed/pending bookings for popularity? (Optional refinement)
      // if (booking.status === 'CONFIRMED' || booking.status === 'PENDING') {
        const [hour] = booking.time.split(":").map(Number);
        if (hour >= 0 && hour < 24) { // Basic validation
          hourCounts[hour]++;
          hourGuests[hour] += booking.guests;
        }
      // }
    });

    return hourCounts.map((count, hour) => ({
      hour: `${hour.toString().padStart(2, "0")}:00`,
      count,
      guests: hourGuests[hour],
    }));
  };

  const popularTimesData = generatePopularTimesData();
  const maxBookingCount = Math.max(...popularTimesData.map(d => d.count), 1); // Avoid division by zero
  const maxGuestCount = Math.max(...popularTimesData.map(d => d.guests), 1); // Avoid division by zero

  return (
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
          {popularTimesData.filter(d => d.count > 0).length > 0 ? (
            <div className="h-80 flex items-end gap-2 border-b border-border pb-2">
              {popularTimesData
                .map((data, index) => (
                  <div key={data.hour} className="flex flex-col items-center flex-1 group" style={{ minWidth: '30px'}}>
                     <div className="text-xs text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.count}
                     </div>
                    <div
                      className="bg-secondary w-full rounded-t hover:bg-secondary/80 transition-colors"
                      style={{ height: `${Math.max(2, (data.count / maxBookingCount) * 100)}%` }}
                       title={`${data.count} bookings at ${data.hour}`}
                    ></div>
                     <div className="text-xs mt-1 text-center text-muted-foreground pt-1">
                        {index % 2 === 0 ? data.hour : ''} {/* Show labels sparsely */}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
              <p className="text-center text-muted-foreground py-8">No booking data available to analyze popular times.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guest Count by Hour</CardTitle>
          <CardDescription>Total number of guests during each hour</CardDescription>
        </CardHeader>
        <CardContent>
           {popularTimesData.filter(d => d.guests > 0).length > 0 ? (
             <div className="h-80 flex items-end gap-2 border-b border-border pb-2">
               {popularTimesData
                 .map((data, index) => (
                   <div key={data.hour} className="flex flex-col items-center flex-1 group" style={{ minWidth: '30px'}}>
                       <div className="text-xs text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.guests}
                       </div>
                     <div
                       className="bg-primary w-full rounded-t hover:bg-primary/80 transition-colors"
                       style={{ height: `${Math.max(2, (data.guests / maxGuestCount) * 100)}%` }}
                       title={`${data.guests} guests at ${data.hour}`}
                     ></div>
                      <div className="text-xs mt-1 text-center text-muted-foreground pt-1">
                          {index % 2 === 0 ? data.hour : ''} 
                     </div>
                   </div>
                 ))}
             </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">No guest data available to analyze popular times.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PopularTimesView;