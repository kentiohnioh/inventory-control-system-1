-- Inventory Control System (ICS) Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM for user roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'stock_controller', 'viewer');

-- Create ENUM for stock_out reasons
CREATE TYPE stock_out_reason AS ENUM ('sale', 'return', 'damage', 'other');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  telegram_chat_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE SET NULL,
  barcode TEXT UNIQUE,
  description TEXT,
  min_stock_level INTEGER DEFAULT 10,
  default_purchase_price DECIMAL(10, 2) NOT NULL,
  default_selling_price DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  expiry_days_default INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SUPPLIERS TABLE
-- ============================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STOCK_IN TABLE
-- ============================================
CREATE TABLE stock_in (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  purchase_price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  notes TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STOCK_OUT TABLE
-- ============================================
CREATE TABLE stock_out (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selling_price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reason stock_out_reason NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_stock_in_product_id ON stock_in(product_id);
CREATE INDEX idx_stock_in_supplier_id ON stock_in(supplier_id);
CREATE INDEX idx_stock_in_date ON stock_in(date);
CREATE INDEX idx_stock_out_product_id ON stock_out(product_id);
CREATE INDEX idx_stock_out_date ON stock_out(date);
CREATE INDEX idx_products_category ON products(category_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_in ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_out ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Categories are readable by all authenticated users
CREATE POLICY "All authenticated users can read categories" ON categories
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins and managers can insert/update/delete categories
CREATE POLICY "Admins and managers can manage categories" ON categories
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins and managers can update categories" ON categories
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

CREATE POLICY "Only admins can delete categories" ON categories
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Products are readable by all authenticated users
CREATE POLICY "All authenticated users can read products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins and managers can insert/update products
CREATE POLICY "Admins and managers can insert products" ON products
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins and managers can update products" ON products
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

-- Only admins can delete products
CREATE POLICY "Only admins can delete products" ON products
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Suppliers are readable by all authenticated users
CREATE POLICY "All authenticated users can read suppliers" ON suppliers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins and managers can insert/update suppliers
CREATE POLICY "Admins and managers can insert suppliers" ON suppliers
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

CREATE POLICY "Admins and managers can update suppliers" ON suppliers
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM users WHERE role IN ('admin', 'manager'))
  );

-- Only admins can delete suppliers
CREATE POLICY "Only admins can delete suppliers" ON suppliers
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

-- Stock-in is readable by all authenticated users
CREATE POLICY "All authenticated users can read stock_in" ON stock_in
  FOR SELECT USING (auth.role() = 'authenticated');

-- All except viewers can insert stock_in
CREATE POLICY "Admins, managers, and stock_controllers can insert stock_in" ON stock_in
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'manager', 'stock_controller')
    )
  );

-- Stock-out is readable by all authenticated users
CREATE POLICY "All authenticated users can read stock_out" ON stock_out
  FOR SELECT USING (auth.role() = 'authenticated');

-- All except viewers can insert stock_out
CREATE POLICY "Admins, managers, and stock_controllers can insert stock_out" ON stock_out
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role IN ('admin', 'manager', 'stock_controller')
    )
  );

-- ============================================
-- VIEWS FOR CALCULATIONS
-- ============================================
CREATE OR REPLACE VIEW current_stock AS
SELECT 
  p.id,
  p.name,
  p.category_id,
  COALESCE(SUM(CASE WHEN si.id IS NOT NULL THEN si.quantity ELSE 0 END), 0) as total_in,
  COALESCE(SUM(CASE WHEN so.id IS NOT NULL THEN so.quantity ELSE 0 END), 0) as total_out,
  COALESCE(SUM(CASE WHEN si.id IS NOT NULL THEN si.quantity ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN so.id IS NOT NULL THEN so.quantity ELSE 0 END), 0) as current_quantity,
  p.min_stock_level,
  p.default_purchase_price,
  p.default_selling_price
FROM products p
LEFT JOIN stock_in si ON p.id = si.product_id
LEFT JOIN stock_out so ON p.id = so.product_id
GROUP BY p.id, p.name, p.category_id, p.min_stock_level, p.default_purchase_price, p.default_selling_price;

-- ============================================
-- VIEWS FOR LOW STOCK ALERTS
-- ============================================
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  cs.id,
  cs.name,
  cs.current_quantity,
  cs.min_stock_level,
  (cs.min_stock_level - cs.current_quantity) as deficit
FROM current_stock cs
WHERE cs.current_quantity <= cs.min_stock_level
ORDER BY (cs.min_stock_level - cs.current_quantity) DESC;
