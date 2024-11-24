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

-- Zeige eindeutige Kategorie-IDs aus der products Tabelle
SELECT DISTINCT category_id 
FROM products 
WHERE category_id IS NOT NULL;
