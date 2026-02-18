import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, AlertTriangle, TrendingUp, Truck } from 'lucide-react'
import { Pool } from 'pg'

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default async function DashboardPage() {
  try {
    // Get products data
    const productsResult = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `)
    const products = productsResult.rows

    // Get recent stock movements
    const recentStockResult = await pool.query(`
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
      LIMIT 5
    `)
    const recentStockIn = recentStockResult.rows

    // Get low stock items
    const lowStockResult = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock_quantity <= p.reorder_level
      ORDER BY p.stock_quantity ASC
      LIMIT 5
    `)
    const lowStockData = lowStockResult.rows

    // Calculate stats
    const totalProducts = products.length
    const lowStockCount = lowStockData.length
    const totalValue = products.reduce((sum: number, item: any) => {
      return sum + (item.stock_quantity || 0) * (item.price || 0)
    }, 0)

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your Inventory Control System
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> 
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Total Products</span>
                <Package className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Low Stock</span>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {lowStockCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Inventory Value</span>
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                <span>Recent Transactions</span>
                <Truck className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentStockIn.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockCount > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockData.slice(0, 5).map((item: any) => (      
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-background rounded"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm">
                      {item.stock_quantity} / {item.reorder_level}
                    </span>
                  </div>
                ))}
                {lowStockCount > 5 && (
                  <p className="text-sm text-muted-foreground pt-2">
                    and {lowStockCount - 5} more items...       
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Stock Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentStockIn && recentStockIn.length > 0 ? (      
              <div className="space-y-2">
                {recentStockIn.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-muted rounded text-sm"
                  >
                    <span>{item.product_name}</span>
                    <span className={`font-medium ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.quantity > 0 ? `+${item.quantity}` : item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">     
                No recent stock movements
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-red-500 mt-4">Error loading dashboard data. Please check your database connection.</p>
      </div>
    )
  }
}