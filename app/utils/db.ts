import mysql from 'mysql2/promise';

const connectionParams = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ZenFlow",
};

export async function connectDB() {
  const connection = await mysql.createConnection(connectionParams);
  return connection;
}
