'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recordStockOut } from '@/app/actions/stock'

interface StockOutForm {
  productId: string
  quantity: number
  sellingPrice: number
  reason: 'sale' | 'return' | 'damage' | 'other'
}

const REASONS = [
  { value: 'sale', label: 'Sale' },
  { value: 'return', label: 'Customer Return' },
  { value: 'damage', label: 'Damaged' },
  { value: 'other', label: 'Other' },
]

export default function StockOutPage() {
  const [products, setProducts] = useState<any[]>([])
  const [stockMovements, setStockMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<StockOutForm>({
    productId: '',
    quantity: 1,
    sellingPrice: 0,
    reason: 'sale',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, movementsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/stock-movements?type=out'),
        ])

        const productsData = await productsRes.json()
        const movementsData = await movementsRes.json()

        setProducts(productsData)
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
      const result = await recordStockOut(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Stock out recorded successfully!')
        setFormData({
          productId: '',
          quantity: 1,
          sellingPrice: 0,
          reason: 'sale',
        })
        // Refresh movements
        const res = await fetch('/api/stock-movements?type=out')
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
        <h1 className="text-3xl font-bold text-foreground">Stock Out</h1>
        <p className="text-muted-foreground">Record outgoing inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Record Stock Out</CardTitle>
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
                    Reason *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reason: e.target.value as any,
                      })
                    }
                    required
                    disabled={loading}
                  >
                    {REASONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
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
                    Selling Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.sellingPrice === 0 ? '' : formData.sellingPrice}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                      setFormData({
                        ...formData,
                        sellingPrice: isNaN(value) ? 0 : Math.max(0, value),
                      })
                    }}
                    required
                    disabled={loading}
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
                  {loading ? 'Recording...' : 'Record Stock Out'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Recent Movements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Out</CardTitle>
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
                          Reason
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
                          <td className="py-3 px-2 capitalize">
                            {movement.reason}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {movement.quantity}
                          </td>
                          <td className="py-3 px-2 text-right">
                            ${movement.selling_price?.toFixed(2)}
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
                  No stock out records yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
