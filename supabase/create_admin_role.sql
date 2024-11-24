-- Erstelle die is_admin Spalte in der profiles Tabelle
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Erstelle Policies für Admin-Zugriff auf products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with products" ON products
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

CREATE POLICY "Public can view products" ON products
FOR SELECT USING (true);

-- Erstelle Policies für Admin-Zugriff auf categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can do everything with categories" ON categories
FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  )
);

CREATE POLICY "Public can view categories" ON categories
FOR SELECT USING (true);

-- Setze den ersten Admin (ersetze 'user_id' mit der tatsächlichen ID)
-- UPDATE profiles SET is_admin = true WHERE id = 'user_id';
