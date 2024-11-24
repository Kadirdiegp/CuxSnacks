-- Überprüfe, ob die categories Tabelle existiert und Daten enthält
DO $$
BEGIN
    -- Lösche existierende Policies
    DROP POLICY IF EXISTS "Admins can do everything with categories" ON categories;
    DROP POLICY IF EXISTS "Public can view categories" ON categories;
    
    -- Aktiviere RLS für die categories Tabelle
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

    -- Erstelle neue Policies
    CREATE POLICY "Enable read access for all users" ON categories
        FOR SELECT
        USING (true);

    CREATE POLICY "Enable insert for authenticated users only" ON categories
        FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');

    CREATE POLICY "Enable update for authenticated users only" ON categories
        FOR UPDATE
        USING (auth.role() = 'authenticated');

    CREATE POLICY "Enable delete for authenticated users only" ON categories
        FOR DELETE
        USING (auth.role() = 'authenticated');

    -- Lösche alle existierenden Kategorien
    DELETE FROM categories;

    -- Füge Standard-Kategorien hinzu
    INSERT INTO categories (name) VALUES
        ('Elektronik'),
        ('Kleidung'),
        ('Bücher'),
        ('Sport'),
        ('Haushalt'),
        ('Spielzeug'),
        ('Kosmetik'),
        ('Lebensmittel'),
        ('Möbel'),
        ('Garten');

EXCEPTION
    WHEN others THEN
        -- Wenn die Tabelle nicht existiert, erstelle sie
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Aktiviere RLS
        ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

        -- Erstelle Policies
        CREATE POLICY "Enable read access for all users" ON categories
            FOR SELECT
            USING (true);

        CREATE POLICY "Enable insert for authenticated users only" ON categories
            FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Enable update for authenticated users only" ON categories
            FOR UPDATE
            USING (auth.role() = 'authenticated');

        CREATE POLICY "Enable delete for authenticated users only" ON categories
            FOR DELETE
            USING (auth.role() = 'authenticated');

        -- Füge Standard-Kategorien hinzu
        INSERT INTO categories (name) VALUES
            ('Elektronik'),
            ('Kleidung'),
            ('Bücher'),
            ('Sport'),
            ('Haushalt'),
            ('Spielzeug'),
            ('Kosmetik'),
            ('Lebensmittel'),
            ('Möbel'),
            ('Garten');
END $$;
