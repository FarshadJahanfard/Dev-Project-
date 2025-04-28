import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'ZenFlow',
});

export default pool;

// Test the database connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database successfully!');
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
})();