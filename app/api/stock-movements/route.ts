import { query } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') // 'in' or 'out'

  try {
    if (type === 'in') {
      const result = await query(`
        SELECT si.id, si.quantity, si.purchase_price, si.date,
               p.name as product_name, s.name as supplier_name
        FROM stock_in si
        LEFT JOIN products p ON si.product_id = p.id
        LEFT JOIN suppliers s ON si.supplier_id = s.id
        ORDER BY si.date DESC
        LIMIT 20
      `)
      return Response.json(result.rows)
    }

    if (type === 'out') {
      const result = await query(`
        SELECT so.id, so.quantity, so.selling_price, so.reason, so.date,
               p.name as product_name
        FROM stock_out so
        LEFT JOIN products p ON so.product_id = p.id
        ORDER BY so.date DESC
        LIMIT 20
      `)
      return Response.json(result.rows)
    }

    return Response.json([])
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database error'
    return Response.json({ error: message }, { status: 500 })
  }
}
