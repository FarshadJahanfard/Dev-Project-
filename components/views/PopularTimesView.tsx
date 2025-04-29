"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function PopularTimesView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const today = new Date().toISOString().slice(0, 10); // Define today

  useEffect(() => {
    fetch("/api/reserve") 
      .then((res) => res.json()) 
      .then((data) => {
        if (data && data.reservations) {
          const todayDate = new Date(today); // Create a Date object for today
          const todaysBookings = data.reservations.filter((b: any) => { // filter bookings for today
            if (b.booking_date) {
              try {
                const bookingDate = new Date(b.booking_date);
                return (
                  bookingDate.getFullYear() === todayDate.getFullYear() &&
                  bookingDate.getMonth() === todayDate.getMonth() &&
                  bookingDate.getDate() === todayDate.getDate()
                );
              } catch (error) {
                console.error(
                  "Error parsing booking_date:",
                  b.booking_date,
                  error
                );
                return false; // Skip this booking if there's an error
              }
            }
            return false;
          });
          console.log(
            "Today's bookings:",
            todaysBookings
          );
          setBookings(todaysBookings);
        } else {
          setBookings([]);
        }
      })
      .catch(console.error);
  }, [today]);

  const hourlyCounts = Array(24).fill(0);
  const hourlyGuests = Array(24).fill(0);

  bookings.forEach((b) => {
    if (b.booking_time) {
      const hr = parseInt(b.booking_time.slice(0, 2), 10);
      hourlyCounts[hr]++;
      hourlyGuests[hr] += b.guests;
    }
  });

  console.log("Final bookings:", bookings);
  console.log("Hourly counts:", hourlyCounts);
  console.log("Hourly guests:", hourlyGuests);

  const data = hourlyCounts.map((count, i) => ({
    hour: String(i).padStart(2, "0") + ":00",
    bookings: count,
    guests: hourlyGuests[i],
  }));

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        <h1 className="text-2xl font-bold">
          Analytics{" "}
          <span className="font-normal text-gray-600">(Today: {today})</span>
        </h1>
      </h1>

      {/* BOOKINGS CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Hour</CardTitle>
          <CardDescription>Today's reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* GUESTS CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Guest Count by Hour</CardTitle>
          <CardDescription>Today's guests</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="guests" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
