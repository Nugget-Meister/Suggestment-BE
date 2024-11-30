CREATE DATABASE IF NOT EXISTS kc_postgres;

\c kc_postgres;

DROP TABLE IF EXISTS suggestment_transactions;
DROP TABLE IF EXISTS suggestment_users;

CREATE TABLE suggestment_transactions(
    transaction_id SERIAL PRIMARY KEY,
    user_id VARCHAR(256),
    source_user_id VARCHAR(256),
    date TIMESTAMP
);

CREATE TABLE suggestment_users(
    user_id UUID() PRIMARY KEY,
    email VARCHAR(256),
    username VARCHAR(64),
    password VARCHAR(128),
    isVerified BOOLEAN
);