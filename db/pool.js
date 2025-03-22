const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_PUBLIC_URL,
});

pool.connect((err) => {
    if (err) {
        console.error(process.env.PUBLIC_DATABASE_URL + "Failed to connect to PostgreSQL:", err);
    } else {
        console.log("Successfully connected to PostgreSQL");
    }
});

module.exports = pool;