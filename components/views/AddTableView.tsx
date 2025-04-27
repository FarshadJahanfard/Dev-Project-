"use client";

import type React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddTableViewProps {
  onAddTable?: (tableData: {
    tableNumber: string;
    capacity: number;
    location: string;
    isActive: boolean;
  }) => void;
}

const AddTableView: React.FC<AddTableViewProps> = (props) => {
  const { toast } = useToast();

  const handleAddTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Your Table Was Added Successfully!');
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const tableNumber = formData.get("tableNumber") as string;
    const capacity = formData.get("capacity") as string;
    const location = formData.get("location") as string;
    const isActive = formData.get("isActive") as string;

    if (!tableNumber?.trim() || !capacity?.trim() || !location?.trim() || !isActive?.trim()) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    const newTable = {
      tableNumber,
      capacity: Number(capacity),
      location,
      isActive: isActive.toLowerCase() === "yes" ? 1 : 0,
    };

    const res = await fetch('http://localhost:3000/api/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTable),
    });
    

    if (res.ok) {
      toast({
        title: "Table Added",
        description: `Table "${tableNumber}" (Capacity: ${capacity}) has been added.`,
      });
      form.reset();
    } else {
      toast({
        title: "Error",
        description: "Failed to add the table. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair">Add Table</h1>
          <p className="text-muted-foreground">Add new tables to the system</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add a New Table</CardTitle>
          <CardDescription>Provide details for the new table</CardDescription>
        </CardHeader>
        <form onSubmit={handleAddTableSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number/Name</Label>
              <Input id="tableNumber" name="tableNumber" placeholder="e.g., T1, Patio 5, Booth 2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" name="capacity" type="number" min="1" placeholder="Enter table capacity" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Upstairs Cafe, Main Dining, VIP Room, Bar Area" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Is Active</Label>
              <select
                id="isActive"
                name="isActive"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                defaultValue="Yes"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary">
              Add Table
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddTableView;
