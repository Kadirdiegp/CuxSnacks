-- Füge neue Spalten zur products Tabelle hinzu
ALTER TABLE products
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS image TEXT;

-- Erstelle einen Storage Bucket für Produktbilder, falls noch nicht vorhanden
INSERT INTO storage.buckets (id, name)
VALUES ('products', 'Product Images')
ON CONFLICT (id) DO NOTHING;

-- Setze die Storage Policy für öffentlichen Zugriff
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Erlaube authentifizierten Benutzern das Hochladen von Bildern
CREATE POLICY "Authenticated Users Can Upload Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.role() = 'authenticated'
);
