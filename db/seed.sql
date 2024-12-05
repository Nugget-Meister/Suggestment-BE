\c kc_postgres 

INSERT INTO test (name)
VALUES
    ('Kevin'),
    ('Seven'),
    ('Eleven'); 

INSERT INTO suggestment_users(user_id, email, name, password, isVerified) 
VALUES
    (gen_random_uuid(), 'testemail@gmail.com', 'Kevin Kevin','2b$10$Le8QKXSAZn6GBYiE9Z2hYOb0Rz05UcxdmKtkpnXbEHw6qqgkUoTVq', true);


INSERT INTO suggestment_transactions(user_id, source_user_id, details, amount, date)
VALUES
('2482e649-22e0-4c4e-9e1a-caef3fc82609', null, 'Watson Laboratories, Inc.',-15.93, '2024-10-31'),
('2482e649-22e0-4c4e-9e1a-caef3fc82609', null, 'Portal Pharmaceutical',-91.13, '2024-10-04'),
('2482e649-22e0-4c4e-9e1a-caef3fc82609', null, 'TOPCO ASSOCIATES LLC', 571.77, '2024-07-19'),
('2482e649-22e0-4c4e-9e1a-caef3fc82609', 2, 'Burger', -13.74, '2024-05-29'),
('2482e649-22e0-4c4e-9e1a-caef3fc82609', 2, 'Haircut', -43.03, '2024-11-15'),
('2482e649-22e0-4c4e-9e1a-caef3fc82609', null, 'TOPCO ASSOCIATES LLC', 571.77, '2024-01-19');

