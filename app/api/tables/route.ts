import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../utils/db'

export async function POST(request: NextRequest) {
  const { tableNumber, capacity, location, isActive } = await request.json()

  const db = await connectDB()
  await db.query(
    'INSERT INTO tables (table_number, capacity, location, is_active) VALUES (?, ?, ?, ?)',
    [tableNumber, capacity, location, isActive ? 1 : 0]
  )

  return NextResponse.json({ message: 'Table added successfully' })
}
