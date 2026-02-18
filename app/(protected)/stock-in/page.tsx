'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { recordStockIn } from '@/app/actions/stock'

interface StockInForm {
  productId: string
  supplierId: string
  quantity: number
  purchasePrice: number
  expiryDate: string
  notes: string
}

export default function StockInPage() {
  const [products, setProducts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [stockMovements, setStockMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<StockInForm>({
    productId: '',
    supplierId: '',
    quantity: 1,
    purchasePrice: 0,
    expiryDate: '',
    notes: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, suppliersRes, movementsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/suppliers'),
          fetch('/api/stock-movements?type=in'),
        ])

        const productsData = await productsRes.json()
        const suppliersData = await suppliersRes.json()
        const movementsData = await movementsRes.json()

        setProducts(productsData)
        setSuppliers(suppliersData)
        setStockMovements(movementsData)
      } catch (err) {
        console.error('[v0] Error fetching data:', err)
        setError('Failed to load data')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await recordStockIn(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Stock recorded successfully!')
        setFormData({
          productId: '',
          supplierId: '',
          quantity: 1,
          purchasePrice: 0,
          expiryDate: '',
          notes: '',
        })
        // Refresh movements
        const res = await fetch('/api/stock-movements?type=in')
        const data = await res.json()
        setStockMovements(data)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Error recording stock:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Stock In</h1>
        <p className="text-muted-foreground">Record incoming inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Record Stock In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    required
                    disabled={loading}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supplier *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={formData.supplierId}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    required
                    disabled={loading}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Purchase Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchasePrice: parseFloat(e.target.value),
                      })
                    }
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    disabled={loading}
                    rows={2}
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 text-green-800 text-sm p-3 rounded-md">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Recording...' : 'Record Stock In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Movements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock In</CardTitle>
            </CardHeader>
            <CardContent>
              {stockMovements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-2 font-semibold">
                          Product
                        </th>
                        <th className="text-left py-3 px-2 font-semibold">
                          Supplier
                        </th>
                        <th className="text-right py-3 px-2 font-semibold">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-2 font-semibold">
                          Price
                        </th>
                        <th className="text-left py-3 px-2 font-semibold">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockMovements.map((movement) => (
                        <tr key={movement.id} className="border-b hover:bg-muted">
                          <td className="py-3 px-2">
                            {movement.product_name}
                          </td>
                          <td className="py-3 px-2">
                            {movement.supplier_name}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {movement.quantity}
                          </td>
                          <td className="py-3 px-2 text-right">
                            ${movement.purchase_price?.toFixed(2)}
                          </td>
                          <td className="py-3 px-2">
                            {new Date(movement.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No stock in records yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
