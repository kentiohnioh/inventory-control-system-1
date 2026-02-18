'use server'

import { query } from '@/lib/db'

export async function manageSupplie(
  formData: {
    name: string
    contact: string
    email: string
    address: string
    notes?: string
  },
  action: 'create' | 'update' | 'delete',
  supplierId?: string
) {
  try {
    if (action === 'create') {
      const result = await query(
        `INSERT INTO suppliers (name, contact, email, address, notes)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [formData.name, formData.contact, formData.email, formData.address, formData.notes || null]
      )
      return { success: true, data: result.rows[0] }
    }

    if (action === 'update' && supplierId) {
      const result = await query(
        `UPDATE suppliers 
         SET name = $1, contact = $2, email = $3, address = $4, notes = $5
         WHERE id = $6
         RETURNING *`,
        [formData.name, formData.contact, formData.email, formData.address, formData.notes || null, supplierId]
      )
      return { success: true, data: result.rows[0] }
    }

    if (action === 'delete' && supplierId) {
      await query('DELETE FROM suppliers WHERE id = $1', [supplierId])
      return { success: true }
    }

    return { error: 'Invalid action' }
  } catch (error) {
    console.error('[v0] Error managing supplier:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to manage supplier',
    }
  }
}
