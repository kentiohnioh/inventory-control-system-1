import { query } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params
    console.log('=== PUT Request Debug ===')
    console.log('1. Updating supplier with ID:', id)

    const body = await request.json()
    console.log('2. Request body:', body)

    const { name, contact, email, address, notes } = body
    console.log('3. Extracted fields:', { name, contact, email, address, notes })

    if (!name) {
      console.log('4. Validation failed: name is required')
      return Response.json({ error: 'Supplier name is required' }, { status: 400 })
    }

    console.log('4. Executing database query...')
    const result = await query(
      `UPDATE suppliers 
       SET name = $1, contact = $2, email = $3, address = $4, notes = $5 
       WHERE id = $6 
       RETURNING *`,
      [name, contact || null, email || null, address || null, notes || null, id]
    )

    console.log('5. Query result:', result.rows)

    if (result.rows.length === 0) {
      console.log('6. No supplier found with ID:', id)
      return Response.json({ error: 'Supplier not found' }, { status: 404 })
    }

    console.log('6. Supplier updated successfully:', result.rows[0])
    return Response.json(result.rows[0])
  } catch (error) {
    console.error('❌ Error in PUT handler:', error)
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params
    console.log('=== DELETE Request Debug ===')
    console.log('Deleting supplier with ID:', id)

    const result = await query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      return Response.json({ error: 'Supplier not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('❌ Error in DELETE handler:', error)
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}