import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test_db',
  port: 3306,
});

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const body = await readBody(event);

    // Extract ball properties
    const { name, student_class, style, color, artwork, x, y } = body;

    // Insert the new ball into the database
    const [result] = await pool.query(
      'INSERT INTO julekugler (name, student_class, style, color, artwork, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, student_class, style, color, artwork, x, y]
    );

    // Return success response
    return {
      success: true,
      id: result.insertId, // Return the ID of the newly inserted ball
    };
  } catch (error) {
    console.error('Error adding ball:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add ball to database',
      data: error.message,
    });
  }
});
