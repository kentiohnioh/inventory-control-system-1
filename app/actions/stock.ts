'use server'

import { query } from '@/lib/db'

export async function recordStockIn(formData: {
  productId: string
  supplierId: string
  quantity: number
  purchasePrice: number
  expiryDate: string
  notes: string
}) {
  try {
    // Insert stock in record
    const result = await query(
      `INSERT INTO stock_in 
       (product_id, supplier_id, quantity, purchase_price, expiry_date, notes, date, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, 'default-user')
       RETURNING *`,
      [
        formData.productId,
        formData.supplierId,
        formData.quantity,
        formData.purchasePrice,
        formData.expiryDate || null,
        formData.notes || null,
      ]
    )

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('[v0] Error recording stock in:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to record stock in',
    }
  }
}

export async function recordStockOut(formData: {
  productId: string
  quantity: number
  sellingPrice: number
  reason: string
  notes: string
}) {
  try {
    // Insert stock out record
    const result = await query(
      `INSERT INTO stock_out 
       (product_id, quantity, selling_price, reason, notes, date, user_id)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'default-user')
       RETURNING *`,
      [
        formData.productId,
        formData.quantity,
        formData.sellingPrice,
        formData.reason,
        formData.notes || null,
      ]
    )

    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('[v0] Error recording stock out:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to record stock out',
    }
  }
}
