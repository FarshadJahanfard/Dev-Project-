'use client'

import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'

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
    <div className="relative w-full h-[600px] bg-gray-100 border p-4">
      {tables.map(table => {
        if (table.x == null || table.y == null) return null

        return (
          <Draggable
            key={table.id}
            position={{ x: table.x, y: table.y }}
            onStop={(_, data) => handleStop(table.id, data.x, data.y)}
          >
            <div
              className="absolute bg-white border rounded p-2 text-center text-sm shadow cursor-move"
              style={{ width: 80, height: 80 }}
            >
              <div>Table {table.table_number}</div>
              <div>{table.capacity} seats</div>
            </div>
          </Draggable>
        )
      })}
    </div>
  )
}
