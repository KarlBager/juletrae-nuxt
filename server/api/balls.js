import mysql from 'mysql2/promise';


// Create a database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_db',
  port: 3306,
});

export default defineEventHandler(async (event) => {
  try {
    // Example query
    const [rows] = await pool.query('SELECT * FROM julekugler');
    return rows;
  } catch (error) {
    console.error('Error fetching balls:', err.message); // Log the error
    console.error(err.stack); // Log the stack trace for debugging
    throw createError({
      statusCode: 500,
      statusMessage: 'Database query failed',
      data: err.message, // Include additional error details if needed
    });
  }
});
