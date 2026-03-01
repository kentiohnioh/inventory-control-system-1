
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: string | number
  name?: string
  category_name?: string
  min_stock_level?: number
  default_purchase_price?: number | string
  default_selling_price?: number | string
  unit?: string
  // add more fields if needed
}

export default function ProductsPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ role?: string } | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [stockMap, setStockMap] = useState<Record<string | number, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [productsRes, stockRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/current-stock'),
        ])

        const productsData = await productsRes.json()
        const stockData = await stockRes.json()

        setProducts(Array.isArray(productsData) ? productsData : [])
        setStockMap(typeof stockData === 'object' && stockData !== null ? stockData : {})
      } catch (error) {
        console.error('Error fetching products/stock:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const isStockController = user?.role === 'stock' || user?.role === 'stock_controller'

  const formatPrice = (price: number | string | null | undefined): string => {
    if (price == null) return '0.00'

    const num = typeof price === 'string' ? parseFloat(price) : price
    return Number.isNaN(num) ? '0.00' : num.toFixed(2)
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      console.log('Deleting product ID:', id)

      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        let errorMessage = 'Failed to delete product'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Delete result:', result)

      // Refresh products list
      const productsRes = await fetch('/api/products')
      const productsData = await productsRes.json()
      setProducts(Array.isArray(productsData) ? productsData : [])

      // Refresh stock data
      const stockRes = await fetch('/api/current-stock')
      const stockData = await stockRes.json()
      setStockMap(typeof stockData === 'object' && stockData !== null ? stockData : {})

      alert('Product deleted successfully!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete product. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading...</div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

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
          {products.length > 0 ? (
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
                  {products.map((product) => {
                    const currentStock = stockMap[product.id] ?? 0
                    const isLowStock = currentStock <= (product.min_stock_level ?? 0)

                    return (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">{product.name || '—'}</td>
                        <td className="py-3 px-4">
                          {product.category_name || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${(stockMap[product.id] ?? 0) <= (product.min_stock_level ?? 0)
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-green-100 text-green-800'
                                }`}
                            >
                              {stockMap[product.id] ?? 0}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {product.unit ?? 'pcs'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          ${formatPrice(product.default_purchase_price)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${formatPrice(product.default_selling_price)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            {isStockController ? (
                              <span className="text-xs text-muted-foreground px-2">
                                View Only
                              </span>
                            ) : (
                              <>
                                <Link href={`/products/${product.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDelete(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products found. Create your first product!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}