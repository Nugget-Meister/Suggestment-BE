\c kc_postgres 

INSERT INTO test (name)
VALUES
    ('Kevin'),
    ('Seven'),
    ('Eleven'); 

INSERT INTO suggestment_users(user_id, email, name, password, isVerified) 
VALUES
    (gen_random_uuid(), 'testemail@gmail.com', 'Kevin Kevin','2b$10$Le8QKXSAZn6GBYiE9Z2hYOb0Rz05UcxdmKtkpnXbEHw6qqgkUoTVq', true);


INSERT INTO suggestment_transactions(user_id, source_user_id, details, amount, date, category)
VALUES
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'Watson Laboratories, Inc.',-15.93, '2024-10-31', 'EXPENSE'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'Portal Pharmaceutical',-91.13, '2024-10-04', 'EXPENSE'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'TOPCO ASSOCIATES LLC', 571.77, '2024-07-19', 'PAYMENT'),
('5003ccea-1131-4d92-9231-8b5f27152d18', 2, 'Burger', -13.74, '2024-05-29', 'EXPENSE'),
('5003ccea-1131-4d92-9231-8b5f27152d18', 2, 'Haircut', -43.03, '2024-11-15', 'EXPENSE'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'TOPCO ASSOCIATES LLC', 571.77, '2024-01-19', 'PAYMENT'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'IBM', -134.25, '2024-09-24', 'PURCHASE');


INSERT INTO suggestment_transactions(user_id, source_user_id, details, amount, date, category)
VALUES
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'Rental Payment LLC', -615.93, '2024-11-04', 'BILL'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'TOPCO ASSOCIATES LLC', 417.89, '2024-11-04', 'PAYMENT'),
('5003ccea-1131-4d92-9231-8b5f27152d18', null, 'Spotify Technology S.A', -19.99, '2024-11-14', 'BILL'),;

