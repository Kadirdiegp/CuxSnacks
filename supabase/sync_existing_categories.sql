-- Lösche alle bestehenden Kategorien
TRUNCATE categories RESTART IDENTITY CASCADE;

-- Füge die existierenden Kategorien ein
INSERT INTO categories (name) VALUES
    ('Getränke'),
    ('Alkohol'),
    ('Snacks'),
    ('Süßigkeiten');

-- Aktualisiere die products Tabelle, um die neue category_id zu verwenden
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER;

-- Aktualisiere die Produkte mit den entsprechenden category_ids
UPDATE products 
SET category_id = c.id 
FROM categories c 
WHERE products.category = c.name;

-- Optional: Wenn Sie die alte category Spalte entfernen möchten (nur ausführen, wenn Sie sicher sind)
-- ALTER TABLE products DROP COLUMN category;
