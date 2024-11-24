-- Zeige alle Kategorien in der categories Tabelle
SELECT * FROM categories ORDER BY id;

-- Zeige alle Produkte mit ihren Kategorien
SELECT p.name as product_name, 
       p.category as old_category, 
       p.category_id,
       c.name as new_category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.name;
