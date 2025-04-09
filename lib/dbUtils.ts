import mysql from 'mysql2/promise';

export const DB_DETAILS: any = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

export async function makeQuery(query: string, params: any[]) {
  console.log(DB_DETAILS)
    return new Promise(async (resolve, reject) => {
      const connection = await mysql.createConnection(DB_DETAILS);
      try {
        connection.query(query, params).then(([rows, fields]) => {
          console.log('Query executed:', query, 'with params:', params);
          resolve(rows);
        }).catch((error) => {
          console.error('Error executing query:', error);
          reject(error);
        }).finally(() => {
          if (connection) {
            connection.end();
          }
        });
      } catch (error) {
        console.error('Database connection error:', error);
        reject(error);
      }
    });
}