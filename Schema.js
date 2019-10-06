const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    connectionLimit: 5
});

async function asyncFunction() {
    let conn;
    let res;
    try {
        // get connection
        conn = await pool.getConnection();
        console.log("Connected!");
        // create database [mydb]
        res = await conn.query("CREATE DATABASE IF NOT EXISTS myDb");
        console.log("Created: database [myDb]");
        // change database to [mydb]
        res = await conn.query("USE mydb");
        console.log("Database changed: [myDb]");
        // create table [myTable]
        res = await conn.query("CREATE TABLE IF NOT EXISTS myTable (number INT,name VARCHAR(255))");
        console.log("Created: table [myTable]");
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
}

asyncFunction();
