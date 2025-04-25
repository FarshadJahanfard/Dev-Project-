import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';
import {sendConfirmationEmail} from "@/lib/sendEmail/emailServer"

const CONNECTION_PARAMS = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ZenFlow'
}

export async function POST(request: Request) {
    const reservationData = await request.json()
    console.log('Received reservation data:', reservationData);
    const { name, email, date, time, guests, notes } = reservationData;
    console.log('Parsed reservation data:', { name, email, date, time, guests, notes });

    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS); // Create a connection to the database
        const [customer_records] = await connection.query<any>('SELECT customer_id, name, email FROM CUSTOMERS WHERE name=? OR email=?', [name, email]); // Check if the customer already exists
        let customerID = undefined;

        if (customer_records.length > 0) {
            // If a customer record exists, retrieve the customer ID
            customerID = customer_records[0].customer_id;
            console.log('Customer ID:', customerID);
        }
        console.log('Customer records:', customer_records);
        if (customer_records.length === 0) {
            // If no customer record exists, insert a new record
            const [new_record] = await connection.query<any>('INSERT INTO CUSTOMERS (name, email) VALUES (?, ?)', [name, email]);
            customerID = new_record.insertId; // Get the ID of the newly inserted record
            console.log('Inserted new customer record:', customerID); 
        }   

        // check Tables ID where size is >= guests
        let [possibleTables] = await connection.query<any>('SELECT table_id FROM TABLES WHERE capacity >= ? ORDER BY capacity ASC', [guests]);
        // guests is a required field and must be a number
        if (!guests || typeof guests !== 'number' || guests <= 0) {
            return NextResponse.json({ 
                error: "`guests` is a required field and must be selected."
            }, { status: 400 });
        }

        // Check if there are any tables +- 2hrs from the time we want (we need 2hrs to eat).
        possibleTables = possibleTables.map((table: any) => table.table_id);

        for (let table of possibleTables) {
            const minTime = new Date(new Date(time).getTime() - (1 * 60 * 60 * 1000) + 1000 ) .toISOString().replace('T', ' ').replace('Z', '') // Time I want to book -2hrs
            const maxTime = new Date(new Date(time).getTime() + (3 * 60 * 60 * 1000) - 1000) .toISOString().replace('T', ' ').replace('Z', '') // Time I want to book +2hrs
            console.log('Checking table:', table, 'for time:', minTime, 'to', maxTime);
            const [BOOKINGS] = await connection.query<any>('SELECT booking_id FROM BOOKINGS WHERE table_id = ? AND booking_date = ? AND booking_time BETWEEN ? AND ?', [table, date, minTime, maxTime]);
            console.log('Bookings:', BOOKINGS);
            if (BOOKINGS.length > 0) {
                // If there are bookings for this table, remove it from possibleTables
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

        const tableID = possibleTables[0]; // Get the first available table

        // Now can use customerID to insert a reservation
        const [reservation] = await connection.query<any>('INSERT INTO BOOKINGS (table_id, customer_id, booking_date, booking_time, guests, special_requests, status) VALUES (?, ?, ?, ?, ?, ?, "PENDING")', [tableID, customerID, date, time, guests, notes]);
        console.log('Inserted reservation:', reservation.insertId);

        const [newReservation] = await connection.query<any>('SELECT * FROM BOOKINGS WHERE booking_id = ?', [reservation.insertId]);
        console.log('New reservation:', newReservation);
        connection.end();

        // send email confirmation 

        await sendConfirmationEmail(
            email, {
                time,
                name,
                date,
                guests,
                reservationID: reservation.insertId
            }
        )

        return NextResponse.json({ reservation: newReservation[0] }, { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}

// new api for fetching reservations to show in admin panel
export async function GET(request: NextRequest) {
    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS); // Create a connection to the database
        const [reservations] = await connection.query<any>('SELECT * FROM BOOKINGS'); // Fetch all reservations
        connection.end();

        return NextResponse.json({ reservations }, { status: 200 });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
}





