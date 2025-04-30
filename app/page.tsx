"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Montserrat, Playfair_Display } from 'next/font/google'; // Import the fonts

// Load the Montserrat font for body text
const montserrat = Montserrat({ subsets: ['latin'] });

// Load the Playfair Display font for headings
const playfairDisplay = Playfair_Display({ subsets: ['latin'] });

export default function Home() {
  const [chosenDate, setChosenDate] = useState<Date>();

  const isPastDate = (dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateToCheck < today;
  };

  const getSelectableTimes = () => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const todayStr = now.toDateString();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();
    const tenAmMins = 10 * 60;
    const openTimeMins = 10 * 60 + 30; // 10:30 AM
    const closeTimeMins = 20 * 60 + 30; // 8:30 PM
    const slots = [];

    for (let mins = openTimeMins; mins <= closeTimeMins; mins += 30) {
      const hour24 = Math.floor(mins / 60);
      const minute = mins % 60;
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      const ampm = hour24 < 12 ? "AM" : "PM";
      const timeVal = `${hour24}:${String(minute).padStart(2, '0')}`;
      const timeLabel = `${hour12}:${String(minute).padStart(2, '0')} ${ampm}`;
      const slotDateTime = new Date();
      slotDateTime.setHours(hour24, minute, 0, 0);

      let disabled = false;

      if (chosenDate) {
        const chosenDateStr = chosenDate.toDateString();
        if (chosenDateStr === todayStr && slotDateTime < now) {
          disabled = true;
        } else if (chosenDateStr === tomorrowStr && mins < tenAmMins) {
          disabled = true;
        }
      }

      slots.push(
        <SelectItem key={timeVal} value={timeVal} disabled={disabled}>
          {timeLabel}
        </SelectItem>
      );
    }
    return slots;
  };

  return (
    <div className={`min-h-screen bg-background ${montserrat.className}`}>
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-3xl md:text-4xl font-bold text-white ${playfairDisplay.className}`}
            >
              ZenFlow
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="h-8 text-white">
                Admin Login
              </Button>
            </Link>
            <Button
              size="sm"
              className="h-8 bg-secondary hover:bg-secondary/90 text-primary"
              onClick={() =>
                document
                  .getElementById("reservation-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Now
            </Button>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Capri-Newmillerdam-interior.jpg"
            alt="Restaurant ambiance"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className={`font-playfair text-4xl md:text-6xl font-bold mb-4 ${playfairDisplay.className}`}>
            Experience Culinary Excellence
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Come and dine at our latest restaurant at Capri Newmillerdam
          </p>
          <Button
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-primary"
            onClick={() =>
              document
                .getElementById("reservation-form")
                ?.scrollIntoView({ behavior: "smooth" })
              }
            >
            Make a Reservation
          </Button>
        </div>
      </section>
      <section className="py-20 bg-muted">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="bg-card">
              <CardHeader>
                <Clock className="w-10 h-10 p-2 text-primary bg-secondary/20 rounded-lg mb-4" />
                <CardTitle className={`font-playfair ${playfairDisplay.className}`}>Opening Hours</CardTitle>
                <CardDescription>Mon-Sun: 10:30 PM - 10:00 PM</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <MapPin className="w-10 h-10 p-2 text-primary bg-secondary/20 rounded-lg mb-4" />
                <CardTitle className={`font-playfair ${playfairDisplay.className}`}>Location</CardTitle>
                <CardDescription>
                  Newmillerdam Branch, 648 Barnsley Rd, Wakefield
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <Phone className="w-10 h-10 p-2 text-primary bg-secondary/20 rounded-lg mb-4" />
                <CardTitle className={`font-playfair ${playfairDisplay.className}`}>Contact</CardTitle>
                <CardDescription>+44 1924 465000</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20" id="reservation-form">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-secondary/20">
              <CardHeader className="text-center">
                <CardTitle className={`font-playfair text-3xl ${playfairDisplay.className}`}>
                  Make a Reservation
                </CardTitle>
                <CardDescription>
                  Book your table for an unforgettable dining experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 font-sans">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    chosenDate?.setHours(1);
                    const formattedDate = chosenDate?.toISOString().split("T")[0];
                    console.log("date", chosenDate);
                    console.log("formattedDate", formattedDate);
                    const time = formData.get("time");
                    const formattedTime = `${formattedDate} ${time}:00`;
                    const reservationData = {
                      name: formData.get("name"),
                      email: formData.get("email"),
                      date: formattedDate,
                      time: formattedTime,
                      guests: Number(formData.get("guests")),
                      notes: formData.get("notes"),
                    };

                    try {
                      const response = await fetch("/api/reserve", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(reservationData),
                      });

                      if (!response.ok) {
                        throw new Error("Failed to submit booking");
                      }

                      const responseJson = await response.json();
                      const bookingId = responseJson.reservation.booking_id;

                      window.location.href = `/booking/${bookingId}`;
                    } catch (error) {
                      console.error(error);
                      alert(
                        "Something went wrong with your reservation request."
                      );
                    }
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-sans">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="border-secondary/20"
                        required
                        aria-required="true"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Your email"
                        type="email"
                        className="border-secondary/20"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={`w-full justify-start text-left font-normal border-secondary/20 ${
                              !chosenDate ? "border-red-500" : ""
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {chosenDate ? format(chosenDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={chosenDate}
                            onSelect={setChosenDate}
                            initialFocus
                            disabled={isPastDate}
                          />
                        </PopoverContent>
                      </Popover>
                      {!chosenDate && (
                        <p className="text-sm text-red-500">
                          Please choose a date.
                        </p>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="time" className="text-base font-medium">
                        Time
                      </Label>
                      <Select name="time" required aria-required="true">
                        <SelectTrigger className="border-secondary/20 h-11">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {getSelectableTimes()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select name="guests" required>
                      <SelectTrigger
                        className="border-secondary/20"
                        aria-required="true"
                      >
                        <SelectValue placeholder="How many people?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5">5 Guests</SelectItem>
                        <SelectItem value="6">6 Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base">
                      Special Requests
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Let us know if you have any dietary requirements or
                      special preferences.
                    </p>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requests or dietary requirements?"
                      className="min-h-[100px] resize-none border-secondary/20"
                    />
                  </div>
                  <div className="mb-5"></div>
                  <CardFooter className="flex flex-col gap-10">
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 text-primary"
                    >
                      Request Reservation
                    </Button>
                    <p className="text-center text-sm text-red-500">
                      Note: All reservations require confirmation from our
                      staff. You will receive an email once your booking is
                      confirmed.
                    </p>
                  </CardFooter>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-20">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <div>
              <h3 className={`font-playfair text-xl mb-4 ${playfairDisplay.className}`}>About Us</h3>
              <p className="text-primary-foreground/80">
                Capri Group is a chain of bars and restaurants known for
                exceptional dining and vibrant atmospheres across Wakefield,
                England.
              </p>
            </div>
            <div>
              <h3 className={`font-playfair text-xl mb-4 ${playfairDisplay.className}`}>Opening Hours</h3>
              <p className="text-primary-foreground/80">
                Every day
                <br />
                10:30 AM - 10:00 PM
              </p>
            </div>
            <div>
              <h3 className={`font-playfair text-xl mb-4 ${playfairDisplay.className}`}>Contact</h3>
              <p className="text-primary-foreground/80">
                648 Barnsley Rd, Newmillerdam,
                <br />
                Wakefield | WF2 6QQ
                <br />
                Call us at +44 1924 465000
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}