'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { query } from '@/lib/db'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState([])
  const [stockMap, setStockMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsRes = await fetch('/api/products')
        const productsData = await productsRes.json()
        setProducts(productsData)

        // Fetch stock data
        const stockRes = await fetch('/api/current-stock')
        const stockData = await stockRes.json()
        setStockMap(stockData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  // Map the role for display
  const displayRole = user?.role === 'stock' ? 'Stock Controller' : user?.role
  const isStockController = user?.role === 'stock' || user?.role === 'stock_controller'

  // Safe number formatting function
  const formatPrice = (price: any): string => {
    if (price === null || price === undefined) return '0.00'
    
    // If it's already a number
    if (typeof price === 'number') {
      return price.toFixed(2)
    }
    
    // If it's a string, try to parse it
    if (typeof price === 'string') {
      const parsed = parseFloat(price)
      return isNaN(parsed) ? '0.00' : parsed.toFixed(2)
    }
    
    // Fallback
    return '0.00'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
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
        {/* Hide New Product button for stock controllers */}
        {!isStockController && (
          <Link href="/products/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </Link>
        )}
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
                      <td className="py-3 px-4">{product.name || '-'}</td>
                      <td className="py-3 px-4">
                        {product.category_name || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (stockMap[product.id as keyof typeof stockMap] || 0) <=
                            (product.min_stock_level || 0)
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {stockMap[product.id as keyof typeof stockMap] || 0} {product.unit || 'pcs'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        ${formatPrice(product.default_purchase_price)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        ${formatPrice(product.default_selling_price)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          {/* Only show Edit/Delete for non-stock controllers */}
                          {!isStockController ? (
                            <>
                              <Link href={`/products/${product.id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground px-2">
                              View Only
                            </span>
                          )}
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