CREATE OR REPLACE FUNCTION delete_old_sessions()
RETURNS TRIGGER AS $$
DECLARE
    sessions_length INT;
    max_length INT := 10;
BEGIN
    -- Compte le nombre de sessions pour l'utilisateur
    SELECT COUNT(id) INTO sessions_length 
    FROM sessions 
    WHERE user_id = NEW.user_id;

    -- Si l'utilisateur a plus de 10 sessions, supprime les sessions les plus anciennes
    IF sessions_length >= max_length THEN
        DELETE FROM sessions
        WHERE id IN (
            SELECT id
            FROM sessions
            WHERE user_id = NEW.user_id
            ORDER BY created_at DESC
            LIMIT sessions_length - max_length
        );
    END IF;

    -- Retourne la ligne insérée
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un déclencheur avant l'insertion dans la table "sessions"
CREATE TRIGGER SESSIONS_BEFORE_INSERT
BEFORE INSERT ON sessions
FOR EACH ROW
EXECUTE FUNCTION delete_old_sessions();

