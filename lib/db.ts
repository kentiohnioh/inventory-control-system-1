import { Pool } from 'pg'

// Create a connection pool to your real PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function query(text: string, params?: unknown[]) {
  try {
    console.log('Executing query:', text.substring(0, 100) + '...')
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    // Return empty rows array instead of mock data
    return { rows: [] }
  }
}

// For debugging - test the database connection
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()')
    console.log('✅ Database connected:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Optional: Add a function to check if tables exist
export async function checkTables() {
  try {
    const tables = ['categories', 'products', 'suppliers', 'stock_movements', 'users']
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [table])
      console.log(`Table ${table}:`, result.rows[0].exists ? '✅' : '❌')
    }
  } catch (error) {
    console.error('Error checking tables:', error)
  }
}