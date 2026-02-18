import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name ASC')
    return Response.json(result.rows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return Response.json({ error: 'Category name is required' }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    )

    return Response.json(result.rows[0], { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}