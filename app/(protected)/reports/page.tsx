import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default async function ReportsPage() {
  try {
    // Get products by category
    const categoryResult = await pool.query(`
      SELECT c.name, COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
    `)
    const categoryData = categoryResult.rows

    // Get stock movement summary
    const movementResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        SUM(CASE WHEN movement_type = 'IN' THEN quantity ELSE 0 END) as stock_in,
        SUM(CASE WHEN movement_type = 'OUT' THEN ABS(quantity) ELSE 0 END) as stock_out
      FROM stock_movements
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 10
    `)
    const movementData = movementResult.rows

    // Get total stats
    const statsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM suppliers) as total_suppliers,
        (SELECT COALESCE(SUM(quantity), 0) FROM stock_movements WHERE movement_type = 'IN') as total_stock_in,
        (SELECT COALESCE(SUM(ABS(quantity)), 0) FROM stock_movements WHERE movement_type = 'OUT') as total_stock_out
    `)
    const stats = statsResult.rows[0]

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.total_products || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Suppliers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats?.total_suppliers || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">+{stats?.total_stock_in || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Out</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">-{stats?.total_stock_out || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <div className="space-y-2">
                {categoryData.map((cat: any) => (
                  <div key={cat.name} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">{cat.name}</span>
                    <span className="font-bold bg-primary/10 px-3 py-1 rounded-full">{cat.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No category data available</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {movementData.length > 0 ? (
              <div className="space-y-3">
                {movementData.map((item: any) => (
                  <div key={item.date} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                    <div className="space-x-4">
                      <span className="text-green-600 font-semibold">+{item.stock_in || 0}</span>
                      <span className="text-red-600 font-semibold">-{item.stock_out || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No movement data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Reports error:', error)
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-red-500 mt-4">Error loading reports. Please check your database connection.</p>
      </div>
    )
  }
}