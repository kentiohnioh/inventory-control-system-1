'use server'

import { query } from '@/lib/db'

export async function createProduct(formData: {
  name: string
  categoryId: string
  barcode: string
  description: string
  minStockLevel: number
  purchasePrice: number
  sellingPrice: number
  unit: string
}) {
  try {
    const result = await query(
      `INSERT INTO products 
       (name, category_id, barcode, description, min_stock_level, 
        default_purchase_price, default_selling_price, unit)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        formData.name,
        formData.categoryId,
        formData.barcode || null,
        formData.description,
        formData.minStockLevel,
        formData.purchasePrice,
        formData.sellingPrice,
        formData.unit,
      ]
    )
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('[v0] Error creating product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

export async function updateProduct(
  productId: string,
  formData: {
    name?: string
    categoryId?: string
    minStockLevel?: number
    purchasePrice?: number
    sellingPrice?: number
  }
) {
  try {
    const updates = []
    const values = [productId]
    let paramIndex = 2

    if (formData.name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(formData.name)
    }
    if (formData.categoryId) {
      updates.push(`category_id = $${paramIndex++}`)
      values.push(formData.categoryId)
    }
    if (formData.minStockLevel !== undefined) {
      updates.push(`min_stock_level = $${paramIndex++}`)
      values.push(formData.minStockLevel)
    }
    if (formData.purchasePrice) {
      updates.push(`default_purchase_price = $${paramIndex++}`)
      values.push(formData.purchasePrice)
    }
    if (formData.sellingPrice) {
      updates.push(`default_selling_price = $${paramIndex++}`)
      values.push(formData.sellingPrice)
    }

    if (updates.length === 0) {
      return { error: 'No updates provided' }
    }

    const result = await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $1 RETURNING *`,
      values
    )
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error('[v0] Error updating product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await query('DELETE FROM products WHERE id = $1', [productId])
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting product:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}
