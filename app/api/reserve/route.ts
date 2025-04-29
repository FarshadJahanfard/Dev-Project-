import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import { sendConfirmationEmail } from "@/lib/sendEmail/emailServer";

const CONNECTION_PARAMS = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ZenFlow'
};

export async function POST(request: Request) {
    const reservationData = await request.json();
    console.log('Received reservation data:', reservationData);
    const { name, email, date, time, guests, notes } = reservationData;
    console.log('Parsed reservation data:', { name, email, date, time, guests, notes });

    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS);
        const [customer_records] = await connection.query<any>('SELECT customer_id, name, email FROM CUSTOMERS WHERE name=? AND email=?', [name, email]);
        let customerID = undefined;

        if (customer_records.length > 0) {
            customerID = customer_records[0].customer_id;
            console.log('Customer ID:', customerID);
        }
        console.log('Customer records:', customer_records);
        if (customer_records.length === 0) {
            const [new_record] = await connection.query<any>('INSERT INTO CUSTOMERS (name, email) VALUES (?, ?)', [name, email]);
            customerID = new_record.insertId;
            console.log('Inserted new customer record:', customerID);
        }

        let [possibleTables] = await connection.query<any>('SELECT table_id FROM TABLES WHERE capacity >= ? ORDER BY capacity ASC', [guests]);
        if (!guests || typeof guests !== 'number' || guests <= 0) {
            return NextResponse.json({
                error: "`guests` is a required field and must be selected."
            }, { status: 400 });
        }

        possibleTables = possibleTables.map((table: any) => table.table_id);

        for (let table of possibleTables) {
            const minTime = new Date(new Date(time).getTime() - (1 * 60 * 60 * 1000) + 1000).toISOString().replace('T', ' ').replace('Z', '');
            const maxTime = new Date(new Date(time).getTime() + (3 * 60 * 60 * 1000) - 1000).toISOString().replace('T', ' ').replace('Z', '');
            console.log('Checking table:', table, 'for time:', minTime, 'to', maxTime);
            const [BOOKINGS] = await connection.query<any>('SELECT booking_id FROM BOOKINGS WHERE table_id = ? AND booking_date = ? AND booking_time BETWEEN ? AND ?', [table, date, minTime, maxTime]);
            console.log('Bookings:', BOOKINGS);
            if (BOOKINGS.length > 0) {
                console.log('Table', table, 'is already booked for the given date and time');
                possibleTables = possibleTables.filter((t: any) => t !== table);
            }
            console.log('Possible tables after filtering:', possibleTables);
        }

        console.log('Possible tables', possibleTables);
        if (possibleTables.length === 0) {
            console.log('No available tables for the given date and time');
            return NextResponse.json({ error: 'No available tables for the given date and time' }, { status: 400 });
        }

        const tableID = possibleTables[0]; // Take the first available table

        const [reservation] = await connection.query<any>('INSERT INTO BOOKINGS (table_id, customer_id, booking_date, booking_time, guests, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, "PENDING")', [tableID, customerID, date, time, guests, notes]);
        console.log('Inserted reservation:', reservation.insertId);

        const [newReservation] = await connection.query<any>('SELECT * FROM BOOKINGS WHERE booking_id = ?', [reservation.insertId]);
        console.log('New reservation:', newReservation);
        connection.end();

        await sendConfirmationEmail(
            email, {
                time,
                name,
                date,
                guests,
                reservationID: reservation.insertId
            }
        );

        return NextResponse.json({ reservation: newReservation[0] }, { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS);
        const [reservations] = await connection.query<any>('SELECT * FROM BOOKINGS');
        connection.end();

        return NextResponse.json({ reservations }, { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}