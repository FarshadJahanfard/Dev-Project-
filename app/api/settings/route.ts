import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';

const CONNECTION_PARAMS = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ZenFlow'
};

async function getSettingValueFromDatabase(settingName: string): Promise<string | null> {
    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS);
        const [rows] = await connection.execute<any>(
            'SELECT setting_value FROM settings WHERE setting_name = ?',
            [settingName]
        );
        await connection.end();
        return rows.length > 0 ? rows[0].setting_value : null;
    } catch (error) {
        console.error(`Error getting setting '${settingName}':`, error);
        return null;
    }
}

async function updateSettingValueInDatabase(settingName: string, settingValue: string): Promise<void> {
    try {
        const connection = await mysql.createConnection(CONNECTION_PARAMS);
        await connection.execute(
            'INSERT INTO settings (setting_name, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [settingName, settingValue, settingValue]
        );
        await connection.end();
    } catch (error) {
        console.error(`Error updating setting '${settingName}':`, error);
    }
}

export async function GET(request: NextRequest) {
    try {
        const fullyBookedValue = await getSettingValueFromDatabase('fullyBooked');
        const settings = {
            fullyBooked: fullyBookedValue === 'true',
        };
        return NextResponse.json(settings, { status: 200 });
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { fullyBooked } = await request.json();
        console.log('Received data:', { fullyBooked });
        if (typeof fullyBooked === 'boolean') {
            await updateSettingValueInDatabase('fullyBooked', String(fullyBooked));
            return NextResponse.json({ message: 'Settings updated' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Invalid fullyBooked value' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error handling POST request:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}