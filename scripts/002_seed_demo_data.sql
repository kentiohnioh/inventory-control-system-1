-- Seed Categories
INSERT INTO categories (id, name) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Beverages'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Dairy'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Snacks'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Fresh Produce'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Frozen Foods')
ON CONFLICT DO NOTHING;

-- Seed Suppliers
INSERT INTO suppliers (id, name, contact, email, address) VALUES
  ('d47ac10b-58cc-4372-a567-0e02b2c3d479', 'Fresh Foods Ltd', '555-0001', 'contact@freshfoods.com', '123 Main St'),
  ('d47ac10b-58cc-4372-a567-0e02b2c3d480', 'Beverage Co', '555-0002', 'sales@beverageco.com', '456 Oak Ave'),
  ('d47ac10b-58cc-4372-a567-0e02b2c3d481', 'Quick Snacks Inc', '555-0003', 'info@quicksnacks.com', '789 Elm Rd')
ON CONFLICT DO NOTHING;

-- Seed Products
INSERT INTO products (id, name, category_id, barcode, description, min_stock_level, default_purchase_price, default_selling_price, unit) VALUES
  ('a47ac10b-58cc-4372-a567-0e02b2c3d479', 'Orange Juice 1L', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '1234567890001', 'Fresh Orange Juice', 20, 2.50, 4.99, 'bottle'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d480', 'Milk 1L', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '1234567890002', 'Whole Milk', 15, 1.80, 3.49, 'bottle'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d481', 'Bread White', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '1234567890003', 'White Bread Loaf', 10, 1.50, 2.99, 'loaf'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d482', 'Apples (Gala)', 'f47ac10b-58cc-4372-a567-0e02b2c3d482', '1234567890004', 'Fresh Gala Apples', 30, 0.80, 1.49, 'lb'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d483', 'Frozen Pizza', 'f47ac10b-58cc-4372-a567-0e02b2c3d483', '1234567890005', 'Cheese Frozen Pizza', 12, 4.00, 7.99, 'pcs'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d484', 'Cheese', 'f47ac10b-58cc-4372-a567-0e02b2c3d480', '1234567890006', 'Cheddar Cheese Block', 8, 5.00, 9.99, 'pcs'),
  ('a47ac10b-58cc-4372-a567-0e02b2c3d485', 'Potato Chips', 'f47ac10b-58cc-4372-a567-0e02b2c3d481', '1234567890007', 'Salty Potato Chips', 25, 0.75, 1.49, 'bag')
ON CONFLICT DO NOTHING;
