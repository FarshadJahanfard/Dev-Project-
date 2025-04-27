import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '../../utils/db'  

export async function POST(request: NextRequest) {
  const { id, x, y } = await request.json()

  const db = await connectDB()
  
  await db.query(
    'UPDATE tables SET x = ?, y = ? WHERE table_id = ?',
    [x, y, id]
  )

  return NextResponse.json({ message: 'Location updated' })
}
