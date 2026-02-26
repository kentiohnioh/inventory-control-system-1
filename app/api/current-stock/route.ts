import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const result = await query(`
      SELECT id, stock_quantity as current_quantity 
      FROM products
    `)
    
    // Convert to an object with product id as key
    const stockMap = Object.fromEntries(
      result.rows.map((item: any) => [item.id, item.current_quantity || 0])
    )
    
    return NextResponse.json(stockMap)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 })
  }
}