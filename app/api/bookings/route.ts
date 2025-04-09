'use server'

import { NextResponse, NextRequest } from "next/server";
import { makeQuery } from "@/lib/dbUtils";


export async function GET(request: NextRequest) {
    try {
        const rows: any = await makeQuery(`
             SELECT 
                B.booking_id AS id,
                C.name,
                C.email,
                B.booking_date AS date,
                TIME_FORMAT(B.booking_time, '%H:%i') AS time,
                B.guests,
                B.special_requests AS notes,
                B.status,
                T.table_number AS \`table\`
            FROM BOOKINGS B
            JOIN CUSTOMERS C ON B.customer_id = C.customer_id
            JOIN TABLES T ON B.table_id = T.table_id
            WHERE DATE(B.booking_date) = CURDATE()
            ORDER BY B.booking_time DESC
        `, []);

        console.log('Fetched reservations:', rows);

        return NextResponse.json({ reservations: rows }, { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}
