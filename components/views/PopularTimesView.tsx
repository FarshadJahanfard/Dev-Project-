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
import { format } from 'date-fns';

// Restaurant's opening and closing times
const openingTimeDecimal = 10.5; 
const closingTimeDecimal = 21.0; 
const totalHours = closingTimeDecimal - openingTimeDecimal;

export default function PopularTimesView() {
  const [bookings, setBookings] = useState<any[]>([]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch("/api/reserve")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.reservations) {
          const todayDate = new Date(today); // create a Date object for today
          // Filter bookings for today
          const todaysBookings = data.reservations.filter((b: any) => {
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
            "Todays bookings:",
            todaysBookings
          );
          setBookings(todaysBookings);
        } else {
          setBookings([]);
        }
      })
      .catch(console.error);
  }, [today]);

  const timeSlotsCounts = Array(Math.ceil(totalHours * 2)).fill(0); // 30 min intervals
  const timeSlotsGuests = Array(Math.ceil(totalHours * 2)).fill(0);

  bookings.forEach((b) => {
    if (b.booking_time) {
      const [hoursStr, minutesStr] = b.booking_time.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const decimalTime = hours + minutes / 60;

      if (decimalTime >= openingTimeDecimal && decimalTime < closingTimeDecimal) {
        const slotIndex = Math.floor((decimalTime - openingTimeDecimal) * 2);
        timeSlotsCounts[slotIndex]++;
        timeSlotsGuests[slotIndex] += b.guests;
      }
    }
  });

  const chartData = timeSlotsCounts.map((count, i) => {
    const decimalHour = openingTimeDecimal + i / 2;
    const hour = Math.floor(decimalHour);
    const minute = (decimalHour - hour) * 60;
    const date = new Date();
    date.setHours(hour, minute, 0);
    return {
      time: format(date, 'h:mm a'),
      bookings: count,
      guests: timeSlotsGuests[i],
      rawTime: decimalHour, // for sorting
    };
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Analytics{" "}
        <span className="font-normal text-gray-600">(Today: {today})</span>
      </h1>

      {/* BOOKINGS CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings by Time Slot ({format(new Date(0, 0, 0, Math.floor(openingTimeDecimal), (openingTimeDecimal - Math.floor(openingTimeDecimal)) * 60), 'h:mm a')} - {format(new Date(0, 0, 0, Math.floor(closingTimeDecimal), (closingTimeDecimal - Math.floor(closingTimeDecimal)) * 60), 'h:mm a')})</CardTitle>
          <CardDescription>Today's reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="time" />
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
          <CardTitle>Guest Count by Time Slot ({format(new Date(0, 0, 0, Math.floor(openingTimeDecimal), (openingTimeDecimal - Math.floor(openingTimeDecimal)) * 60), 'h:mm a')} - {format(new Date(0, 0, 0, Math.floor(closingTimeDecimal), (closingTimeDecimal - Math.floor(closingTimeDecimal)) * 60), 'h:mm a')})</CardTitle>
          <CardDescription>Today's guests</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="time" />
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