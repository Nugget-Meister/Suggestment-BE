const pg = require("pg-promise")();

require("dotenv").config();

const cn = process.env.PG_URL ? {
    connectionString: process.env.PG_URL,
    ssl: true,
    max: 30
} : {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER
}


const db = pg(cn);

console.log('postgres: ', cn)

module.exports = db