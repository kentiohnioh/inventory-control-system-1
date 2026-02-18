import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT * FROM suppliers ORDER BY name ASC')
    return Response.json(result.rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}
