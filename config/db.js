const mysql = require('mysql2');

// MySQL Connection 
const pool = mysql.createPool({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    connectTimeout: 10000,
    ssl: {
        rejectUnauthorized: false
    }
});

// helper function to perform SQL queries
const query = async (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    pool,
    query
};