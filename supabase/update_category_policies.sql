-- Lösche existierende Policies
DROP POLICY IF EXISTS "Admins can do everything with categories" ON categories;
DROP POLICY IF EXISTS "Public can view categories" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;

-- Aktiviere RLS für die categories Tabelle
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Erstelle neue Policies
CREATE POLICY "Enable read access for all users" ON categories
    FOR SELECT
    USING (true);

CREATE POLICY "Enable all actions for authenticated users" ON categories
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
