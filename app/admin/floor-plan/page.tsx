'use client'
import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type Table = {
  id: number
  table_number: string
  capacity: number
  x: number | null
  y: number | null
  isActive: number
}

export default function FloorPlan() {
  const [tables, setTables] = useState<Table[]>([])

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch('/api/tables')
        const data = await res.json()
        const formatted = data.tables.map((t: any) => ({
          id: t.table_id,
          table_number: t.table_number,
          capacity: t.capacity,
          x: t.x,
          y: t.y,
          isActive: t.is_active
        }))
        setTables(formatted)
      } catch (err) {
        console.error('Error fetching tables:', err)
      }
    }
    fetchTables()
  }, [])

  const handleStop = async (id: number, x: number, y: number) => {
    try {
      await fetch('/api/update-table-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, x, y }),
      })
    } catch (err) {
      console.error('Error updating table location:', err)
    }
    setTables(prev =>
      prev.map(t => (t.id === id ? { ...t, x, y } : t))
    )
  }

  return (
    <div className="p-6">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      {/* Floor Plan */}
      <div
        className="relative w-full h-[90vh] bg-gray-50 border rounded-lg overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), ' +
            'linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {/* Bar*/}
        <div
          className="absolute border border-blue-300 bg-blue-100 rounded-lg flex items-center justify-center text-lg font-medium text-blue-800"
          style={{ left: 42, top: 20, width: 918, height: 100 }}
        >
          Bar
        </div>

        {/* Main Dining */}
        <div
          className="absolute border border-yellow-300 bg-yellow-100 rounded-lg flex items-center justify-center text-lg font-medium text-yellow-800"
          style={{ left: 41, top: 162, width: 558, height: 500 }}
        > 
          Main Dining
        </div>

        {/* VIP Room */}
        <div
          className="absolute border border-purple-300 bg-purple-100 rounded-lg flex items-center justify-center text-lg font-medium text-purple-800"
          style={{ left: 624, top: 161, width: 335, height: 500 }}
        >
          VIP Room
        </div>

        {/* Draggable Tables */}
        {tables.map(table => {
          if (table.x == null || table.y == null) return null

          return (
            <Draggable
              key={table.id}
              position={{ x: table.x, y: table.y }}
              onStop={(_, data) => handleStop(table.id, data.x, data.y)}
            >
              <div
                className="absolute p-2 text-center text-sm shadow-lg cursor-move rounded-lg bg-white border border-gray-300"
                style={{ width: 100, height: 60 }}
              >
                <div className="font-medium">Table {table.table_number}</div>
                <div className="text-xs">{table.capacity} seats</div>
              </div>
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}
