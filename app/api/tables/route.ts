import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../utils/db'

export async function POST(request: NextRequest) {
  const { tableNumber, capacity, x, y, isActive } = await request.json()

  const db = await connectDB()
  await db.query(
    'INSERT INTO tables (table_number, capacity, x, y, is_active) VALUES (?, ?, ?, ?, ?)',
    [tableNumber, capacity, x, y, isActive ? 1 : 0]
  )

  return NextResponse.json({ message: 'Table added successfully' })
}


// get all tables

export async function GET() {
  const db = await connectDB()
  const [tables] = await db.query('SELECT * FROM tables')

  return NextResponse.json({ tables })
}