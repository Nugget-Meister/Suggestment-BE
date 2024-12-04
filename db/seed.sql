\c kc_postgres 

INSERT INTO test (name)
VALUES
    ('Kevin'),
    ('Seven'),
    ('Eleven'); 

INSERT INTO suggestment_users(user_id, email, name, password, isVerified) 
VALUES
    (gen_random_uuid(),'test@test.com', 'John Doe', 'test123', true);