-- Überprüfe, ob der Benutzer bereits existiert
DO $$
DECLARE
    user_exists boolean;
    user_id uuid;
BEGIN
    -- Prüfe, ob der Benutzer in auth.users existiert
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'kadir.diego@web.de'
    ) INTO user_exists;

    IF NOT user_exists THEN
        -- Erstelle einen neuen Benutzer in auth.users
        user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            user_id,
            'kadir.diego@web.de',
            crypt('Admin123', gen_salt('bf')),
            now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Admin User"}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        );

        -- Erstelle das Profil mit Admin-Rechten
        INSERT INTO public.profiles (id, email, full_name, is_admin)
        VALUES (user_id, 'kadir.diego@web.de', 'Admin User', true);
    ELSE
        -- Hole die user_id des existierenden Benutzers
        SELECT id INTO user_id FROM auth.users WHERE email = 'kadir.diego@web.de';
        
        -- Aktualisiere das Passwort
        UPDATE auth.users 
        SET encrypted_password = crypt('Admin123', gen_salt('bf'))
        WHERE id = user_id;
        
        -- Stelle sicher, dass der Benutzer Admin-Rechte hat
        UPDATE public.profiles 
        SET is_admin = true 
        WHERE id = user_id;
        
        -- Wenn kein Profil existiert, erstelle eines
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
            INSERT INTO public.profiles (id, email, full_name, is_admin)
            VALUES (user_id, 'kadir.diego@web.de', 'Admin User', true);
        END IF;
    END IF;
END $$;
