-- Lösche alle existierenden Daten
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE products CASCADE;

-- Füge fehlende Spalten hinzu
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Füge Produkte in die Datenbank ein
INSERT INTO products (name, description, price, image, category, stock, rating, discount, featured) 
VALUES 
-- Basis Snacks
('Lay''s Classic', 'Klassische Kartoffelchips', 1.99, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', 'Snacks', 100, 4.5, null, false),
('Doritos Nacho Cheese', 'Nachokäse Tortilla Chips', 2.49, 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca', 'Snacks', 80, 4.6, null, false),
('Pringles Original', 'Original Stapelchips', 2.99, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c', 'Snacks', 75, 4.4, null, false),

-- Basis Süßigkeiten
('Haribo Goldbären', 'Klassische Gummibärchen', 1.49, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f', 'Süßigkeiten', 120, 4.7, null, false),
('Milka Alpenmilch', 'Zarte Alpenmilchschokolade', 1.29, 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e', 'Süßigkeiten', 90, 4.8, null, false),
('Snickers', 'Schokoriegel mit Erdnüssen', 0.99, 'https://images.unsplash.com/photo-1534260164206-2a3a4a72891d', 'Süßigkeiten', 150, 4.6, null, false),

-- Basis Getränke
('Red Bull', 'Energy Drink', 1.99, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a', 'Getränke', 200, 4.5, null, false),
('Monster Energy', 'Energy Drink', 2.49, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e', 'Getränke', 180, 4.4, null, false),
('Coca Cola', 'Klassisches Cola Getränk', 1.99, 'https://images.unsplash.com/photo-1554866585-cd94860890b7', 'Getränke', 100, 4.7, null, false),

-- Basis Alkohol
('Absolut Vodka', 'Premium Wodka aus Schweden', 19.99, 'https://images.unsplash.com/photo-1608885898957-a75e12bf7847', 'Alkohol', 30, 4.6, null, false),
('Jack Daniels', 'Tennessee Whiskey', 24.99, 'https://images.unsplash.com/photo-1609767768775-57b8fb8b344d', 'Alkohol', 25, 4.8, null, false),
('Jägermeister', 'Deutscher Kräuterlikör', 21.99, 'https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1', 'Alkohol', 35, 4.5, null, false),

-- Sale Produkte
('M&Ms Party Pack', 'Großpackung verschiedener M&Ms Sorten', 7.99, 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b', 'Süßigkeiten', 40, 4.8, 30, false),
('Pringles Mega Stack', 'XXL Pringles Vorteilspack mit 4 Dosen', 9.99, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c', 'Snacks', 30, 4.7, 25, false),
('Haribo Mega Box', 'Riesenbox mit verschiedenen Haribo Sorten', 12.99, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f', 'Süßigkeiten', 25, 4.5, 40, false),
('Red Bull 6er Pack', 'Energy Drink Vorteilspack', 11.99, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a', 'Getränke', 50, 4.3, 20, false),
('Doritos Party Mix', 'Mix aus verschiedenen Doritos Sorten', 8.99, 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca', 'Snacks', 35, 4.6, 35, false),
('Monster Energy Box', '12er Pack verschiedener Monster Sorten', 24.99, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e', 'Getränke', 25, 4.4, 45, false),
('Milka Schokoladen Set', 'Premium Geschenkbox mit verschiedenen Milka Sorten', 15.99, 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e', 'Süßigkeiten', 35, 4.2, 30, false),
('Snickers Multipack', 'Großpackung mit 12 Snickers Riegeln', 7.99, 'https://images.unsplash.com/photo-1534260164206-2a3a4a72891d', 'Süßigkeiten', 45, 4.5, 25, false),

-- Featured Produkte
('Premium Snack Box', 'Handverlesene Auswahl der beliebtesten Snacks', 29.99, 'https://images.unsplash.com/photo-1621447504864-d8686e12698c', 'Snacks', 20, 4.9, null, true),
('Luxury Süßigkeiten Set', 'Premium Geschenkbox mit exklusiven Süßigkeiten', 39.99, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f', 'Süßigkeiten', 15, 4.8, null, true),
('Party Getränke Paket', 'Komplettes Set für deine Party mit verschiedenen Getränken', 49.99, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a', 'Getränke', 25, 4.7, null, true),
('Gourmet Chips Selection', 'Premium Auswahl verschiedener Chips-Sorten', 19.99, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b', 'Snacks', 30, 4.9, null, true),
('Energy Mix Box', 'Premium Auswahl verschiedener Energy Drinks', 34.99, 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e', 'Getränke', 20, 4.8, null, true),
('Deluxe Naschbox', 'Luxuriöse Auswahl an Süßigkeiten', 44.99, 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f', 'Süßigkeiten', 15, 4.9, null, true);

-- Füge einige Beispiel-Bewertungen hinzu
INSERT INTO reviews (product_id, rating, comment) 
SELECT 
    p.id,
    p.rating,
    'Tolles Produkt, sehr zufrieden!'
FROM products p;
