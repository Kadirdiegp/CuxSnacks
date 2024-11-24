-- Policies für Produkte
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything with products" ON products;
CREATE POLICY "Admins can do everything with products" ON products
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products
FOR SELECT USING (true);

-- Policies für Kategorien
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can do everything with categories" ON categories;
CREATE POLICY "Admins can do everything with categories" ON categories
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);
