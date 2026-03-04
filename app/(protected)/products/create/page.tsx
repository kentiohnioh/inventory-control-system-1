'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createProduct } from '@/app/actions/products'
import { useEffect } from 'react'

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    barcode: '',
    description: '',
    minStockLevel: 10,
    purchasePrice: 0,
    sellingPrice: 0,
    unit: 'pcs',
  })

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('[v0] Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await createProduct(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/products')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Error creating product:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Product</h1>
        <p className="text-muted-foreground">Add a new product to your inventory</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>
              <Input
                type="text"
                placeholder="e.g., Apple Watch Series 6"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <Input
                  type="text"
                  placeholder="e.g., pcs, box, kg"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Barcode
              </label>
              <Input
                type="text"
                placeholder="Optional barcode"
                value={formData.barcode}
                onChange={(e) =>
                  setFormData({ ...formData, barcode: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="Product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Purchase Price *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.purchasePrice === 0 ? '' : formData.purchasePrice}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                    setFormData({
                      ...formData,
                      purchasePrice: isNaN(value) ? 0 : value,
                    })
                  }}
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
                  placeholder="0.00"
                  value={formData.sellingPrice === 0 ? '' : formData.sellingPrice}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value)
                    setFormData({
                      ...formData,
                      sellingPrice: isNaN(value) ? 0 : value,
                    })
                  }}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Min Stock Level
              </label>
              <Input
                type="number"
                placeholder="10"
                value={formData.minStockLevel === 0 ? '' : formData.minStockLevel}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                  setFormData({
                    ...formData,
                    minStockLevel: isNaN(value) ? 0 : value,
                  })
                }}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
