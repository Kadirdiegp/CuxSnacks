-- Finde die User ID für die E-Mail-Adresse
DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = 'kadir.diego@web.de';

    -- Set admin privileges
    UPDATE profiles
    SET is_admin = true
    WHERE id = user_id;
END $$;
