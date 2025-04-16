"use client";
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";


interface SettingsViewProps {
  // Add any props needed from the parent in the future
}

const SettingsView: React.FC<SettingsViewProps> = (props) => {
  // Add state and handlers for settings later
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair">Settings</h1>
          <p className="text-muted-foreground">Configure system parameters</p>
        </div>
      </div>

      <Card>
         <CardHeader>
           <CardTitle>General Settings</CardTitle>
           <CardDescription>Manage general application settings.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Add settings fields here */}
             <div className="space-y-2">
                <Label htmlFor="restaurantName">Restaurant Name</Label>
                <Input id="restaurantName" defaultValue="ZenFlow" />
             </div>
             <div className="flex items-center justify-between space-y-2 border-t pt-4">
                <Label htmlFor="bookingEnabled" className="flex flex-col space-y-1">
                 <span>Booking System Active</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                    Allow users to make new reservations.
                 </span>
                </Label>
                <Switch id="bookingEnabled" defaultChecked />
             </div>
             {/* Example: Add more settings */}
             <div className="space-y-2 border-t pt-4">
                <Label htmlFor="maxGuests">Maximum Guests per Booking</Label>
                <Input id="maxGuests" type="number" defaultValue="8" />
             </div>
             <div className="flex justify-end pt-4">
                 <Button>Save Settings</Button>
             </div>
         </CardContent>
       </Card>

        {/* Add more setting cards/sections as needed */}
        {/* <Card>...</Card> */}

    </div>
  );
};

export default SettingsView;