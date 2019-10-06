const mariadb = require('mariadb');
const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'gudrms63',
    connectionLimit: 5
});

async function asyncFunction() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("Initialized!");
        await conn.query("create database testdb");
        console.log("Create db");
        await conn.query("use testdb");
        await conn.query("create table myTable (number int, name varchar(255))");
        console.log("Create table");
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
}
asyncFunction(); 