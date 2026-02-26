import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT id, name, contact, email, address, notes, created_at FROM suppliers ORDER BY name ASC')
    return Response.json(result.rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact, email, address, notes } = body

    // Validate required fields
    if (!name) {
      return Response.json({ error: 'Supplier name is required' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO suppliers (name, contact, email, address, notes) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, contact || null, email || null, address || null, notes || null]
    )

    return Response.json(result.rows[0], { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}