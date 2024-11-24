-- Erstelle die categories Tabelle
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Aktiviere Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Erstelle Policies
CREATE POLICY "Enable read access for all users" ON categories
    FOR SELECT
    USING (true);

CREATE POLICY "Enable all actions for authenticated users" ON categories
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Füge die existierenden Kategorien ein
INSERT INTO categories (name) VALUES
    ('Getränke'),
    ('Alkohol'),
    ('Snacks'),
    ('Süßigkeiten')
ON CONFLICT (name) DO NOTHING;

-- Füge category_id zur products Tabelle hinzu
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);

-- Aktualisiere die Produkte mit den entsprechenden category_ids
UPDATE products 
SET category_id = c.id 
FROM categories c 
WHERE products.category = c.name;

-- Erstelle einen Trigger für das automatische Aktualisieren des updated_at Feldes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
