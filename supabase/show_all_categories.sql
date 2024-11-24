-- Zeige alle Kategorien, unabhängig davon ob sie Produkte haben
SELECT 
    c.id,
    c.name,
    COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY c.id;
