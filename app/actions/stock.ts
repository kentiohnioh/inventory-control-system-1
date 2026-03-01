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
    // Start a transaction
    await query('BEGIN')

    try {
      // Insert stock in record into stock_movements (not stock_in)
      const movementResult = await query(
        `INSERT INTO stock_movements 
         (product_id, supplier_id, quantity, purchase_price, expiry_date, notes, movement_type, date) 
         VALUES ($1, $2, $3, $4, $5, $6, 'IN', CURRENT_DATE)
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

      // Update product stock quantity - THIS IS THE KEY PART THAT WAS MISSING
      await query(
        `UPDATE products 
         SET stock_quantity = COALESCE(stock_quantity, 0) + $1 
         WHERE id = $2`,
        [formData.quantity, formData.productId]
      )

      await query('COMMIT')
      return { success: true, data: movementResult.rows[0] }
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
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
    // Start a transaction
    await query('BEGIN')

    try {
      // Insert stock out record into stock_movements
      const movementResult = await query(
        `INSERT INTO stock_movements 
         (product_id, quantity, selling_price, reason, notes, movement_type, date) 
         VALUES ($1, $2, $3, $4, $5, 'OUT', CURRENT_DATE)
         RETURNING *`,
        [
          formData.productId,
          formData.quantity,
          formData.sellingPrice,
          formData.reason,
          formData.notes || null,
        ]
      )

      // Update product stock quantity (subtract)
      await query(
        `UPDATE products 
         SET stock_quantity = COALESCE(stock_quantity, 0) - $1 
         WHERE id = $2`,
        [formData.quantity, formData.productId]
      )

      await query('COMMIT')
      return { success: true, data: movementResult.rows[0] }
    } catch (error) {
      await query('ROLLBACK')
      throw error
    }
  } catch (error) {
    console.error('[v0] Error recording stock out:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to record stock out',
    }
  }
}