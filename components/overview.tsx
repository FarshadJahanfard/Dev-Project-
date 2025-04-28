"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/chart"
// dummy data for the chart
const data = [
  {
    name: "Mon",
    total: 45,
  },
  {
    name: "Tue",
    total: 62,
  },
  {
    name: "Wed",
    total: 78,
  },
  {
    name: "Thu",
    total: 83,
  },
  {
    name: "Fri",
    total: 95,
  },
  {
    name: "Sat",
    total: 102,
  },
  {
    name: "Sun",
    total: 87,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-secondary hover:fill-secondary/80 transition-colors"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

