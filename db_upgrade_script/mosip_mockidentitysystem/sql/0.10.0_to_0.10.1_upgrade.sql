-- Alter the `identity_json` column to be of type `VARCHAR` without a length limit
ALTER TABLE mockidentitysystem.mock_identity
    ALTER COLUMN identity_json TYPE VARCHAR;