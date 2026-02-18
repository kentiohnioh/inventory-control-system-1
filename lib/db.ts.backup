// Mock data - no PostgreSQL dependency
const mockData = {
  categories: [
    { id: '1', name: 'Beverages' },
    { id: '2', name: 'Dairy' },
    { id: '3', name: 'Fresh Produce' },
  ],
  products: [
    { id: '1', name: 'Orange Juice', category_id: '1', current_quantity: 45, default_purchase_price: 2.5, default_selling_price: 4.99, min_stock_level: 20 },
    { id: '2', name: 'Milk', category_id: '2', current_quantity: 8, default_purchase_price: 1.8, default_selling_price: 3.49, min_stock_level: 15 },
    { id: '3', name: 'Apples', category_id: '3', current_quantity: 50, default_purchase_price: 0.8, default_selling_price: 1.49, min_stock_level: 30 },
  ],
  suppliers: [
    { id: '1', name: 'Fresh Foods Ltd', contact: '555-0001', email: 'contact@freshfoods.com', address: '123 Main St' },
  ],
  stock_in: [],
  stock_out: [],
}

export async function query(text: string, params?: unknown[]) {
  // Return mock data - always works without database
  if (text.includes('categories')) return { rows: mockData.categories }
  if (text.includes('current_stock')) return { rows: mockData.products }
  if (text.includes('stock_in')) return { rows: mockData.stock_in }
  if (text.includes('stock_out')) return { rows: mockData.stock_out }
  if (text.includes('products')) return { rows: mockData.products }
  if (text.includes('suppliers')) return { rows: mockData.suppliers }
  return { rows: [] }
}
