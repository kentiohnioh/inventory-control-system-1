import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import ProductsList from '@/components/products/products-list'
import { query } from '@/lib/db'

export default async function ProductsPage() {
  let products = []
  let stockMap: Record<string, any> = {}

  try {
    // Get all products with categories
    const result = await query(`
      SELECT p.id, p.name, p.category_id, p.barcode, p.description,
             p.min_stock_level, p.default_purchase_price, p.default_selling_price,
             p.unit, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name ASC
    `)
    products = result.rows
  } catch (error) {
    console.error('[v0] Error fetching products:', error)
  }

  try {
    // Get current stock for each product
    const result = await query('SELECT id, current_quantity FROM current_stock')
    stockMap = Object.fromEntries(
      result.rows.map((item: any) => [item.id, item.current_quantity])
    )
  } catch (error) {
    console.error('[v0] Error fetching stock:', error)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory
          </p>
        </div>
        <Link href="/products/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </Link>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 font-semibold">Stock</th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Purchase Price
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Selling Price
                    </th>
                    <th className="text-center py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(products as any[]).map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">
                        {(product.categories as any)?.name || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (stockMap[product.id] || 0) <=
                            product.min_stock_level
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {stockMap[product.id] || 0} {product.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        ${product.default_purchase_price?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ${product.default_selling_price?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Link href={`/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Create your first product!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
