-- Liste alle Tabellen auf, die "category" oder "categories" im Namen haben
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%categ%';

-- Zeige die Struktur der products Tabelle
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'products';

-- Zeige eindeutige Kategorien aus der products Tabelle
SELECT DISTINCT category 
FROM products 
WHERE category IS NOT NULL;
