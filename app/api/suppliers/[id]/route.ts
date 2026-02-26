import { query } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, contact, email, address, notes } = body

    if (!name) {
      return Response.json({ error: 'Supplier name is required' }, { status: 400 })
    }

    const result = await query(
      `UPDATE suppliers 
       SET name = $1, contact = $2, email = $3, address = $4, notes = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, contact || null, email || null, address || null, notes || null, id]
    )

    if (result.rows.length === 0) {
      return Response.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return Response.json(result.rows[0])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const result = await query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return Response.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}