"use client";
import type React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface TableUsageData {
    table: string;
    CONFIRMED: number;
    PENDING: number;
    REJECTED: number;
    total: number;
}

interface TableUsageViewProps {
  bookings: Booking[];
}

const TableUsageView: React.FC<TableUsageViewProps> = ({ bookings }) => {
  // Generate data for table usage (moved logic here)
  const generateTableUsageData = (): TableUsageData[] => {
    const tables: { [key: string]: { CONFIRMED: number; PENDING: number; REJECTED: number; total: number } } = {};

    bookings.forEach((booking) => {
        // Ensure table name is valid, default if not (optional)
        const tableName = booking.table || 'Unknown';
      if (!tables[tableName]) {
        tables[tableName] = {
          CONFIRMED: 0,
          PENDING: 0,
          REJECTED: 0,
          total: 0,
        };
      }

      if (booking.status === "CONFIRMED" || booking.status === "PENDING" || booking.status === "REJECTED") {
        tables[tableName][booking.status]++;
        tables[tableName].total++;
      }
    });

    return Object.entries(tables)
      .map(([table, data]) => ({
        table,
        ...data,
      }))
      .sort((a, b) => a.table.localeCompare(b.table)); // Sort alphabetically by table name
  };

  const tableUsageData = generateTableUsageData();
  const sortedByUsage = [...tableUsageData].sort((a, b) => b.total - a.total);
  const totalTables = tableUsageData.length;
  const averageBookings = totalTables > 0 ? (bookings.length / totalTables).toFixed(1) : "0.0";


  return (
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
          {tableUsageData.length > 0 ? (
             <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Table</TableHead>
                    <TableHead className="text-center">Confirmed</TableHead>
                    <TableHead className="text-center">Pending</TableHead>
                    <TableHead className="text-center">Rejected</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="min-w-[150px]">Usage Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableUsageData.map((table) => (
                    <TableRow key={table.table}>
                      <TableCell className="font-medium">{table.table}</TableCell>
                      <TableCell className="text-center">{table.CONFIRMED}</TableCell>
                      <TableCell className="text-center">{table.PENDING}</TableCell>
                      <TableCell className="text-center">{table.REJECTED}</TableCell>
                      <TableCell className="text-center">{table.total}</TableCell>
                      <TableCell>
                        {table.total > 0 ? (
                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
                            {table.CONFIRMED > 0 && (
                                <div
                                className="bg-green-500 h-full"
                                style={{ width: `${(table.CONFIRMED / table.total) * 100}%` }}
                                title={`Confirmed: ${((table.CONFIRMED / table.total) * 100).toFixed(1)}%`}
                                ></div>
                            )}
                            {table.PENDING > 0 && (
                                <div
                                className="bg-yellow-500 h-full"
                                style={{ width: `${(table.PENDING / table.total) * 100}%` }}
                                title={`Pending: ${((table.PENDING / table.total) * 100).toFixed(1)}%`}
                                ></div>
                            )}
                            {table.REJECTED > 0 && (
                                <div
                                className="bg-red-500 h-full"
                                style={{ width: `${(table.REJECTED / table.total) * 100}%` }}
                                title={`Rejected: ${((table.REJECTED / table.total) * 100).toFixed(1)}%`}
                                ></div>
                            )}
                            </div>
                        ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <p className="text-center text-muted-foreground py-8">No table usage data available.</p>
           )}
        </CardContent>
      </Card>

       {tableUsageData.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg">Most Used Table</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold">
                 {sortedByUsage[0]?.table || "N/A"}
               </div>
               <p className="text-muted-foreground text-sm">
                 {sortedByUsage[0]?.total || 0} bookings
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg">Least Used Table</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold">
                 {sortedByUsage[sortedByUsage.length - 1]?.table || "N/A"}
               </div>
               <p className="text-muted-foreground text-sm">
                 {sortedByUsage[sortedByUsage.length - 1]?.total || 0} bookings
               </p>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg">Average Bookings per Table</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-3xl font-bold">
                 {averageBookings}
               </div>
               <p className="text-muted-foreground text-sm">Across {totalTables} tables</p>
             </CardContent>
           </Card>
         </div>
       )}
    </div>
  );
};

export default TableUsageView;