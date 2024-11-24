-- Zeige die Produkte mit ihren Kategorie-Details
SELECT 
    p.id,
    p.name as product_name,
    p.category as old_category_field,
    p.category_id,
    c.id as category_table_id,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 5;
