import { NextResponse, NextRequest } from "next/server";
import mysql from 'mysql2/promise';

export async function PUT(request: NextRequest) {
    const connectionParams = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'ZenFlow'
    };

    
