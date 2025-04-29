"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const SettingsView = () => {
  const [fullyBooked, setFullyBooked] = useState<boolean>(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setFullyBooked(data.fullyBooked || false);
        } else {
          console.error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullyBooked }),
      });

      if (response.ok) {
        alert('Fully booked status updated!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="fullyBooked">Fully Booked</Label>
            <Switch
              id="fullyBooked"
              checked={fullyBooked}
              onCheckedChange={setFullyBooked}
            />
          </div>
          <Button onClick={handleSaveSettings}>Save Status</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsView;