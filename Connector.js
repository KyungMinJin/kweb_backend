const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gudrms63',
  database: 'testdb',
  connectionLimit: 5
});
async function asyncFunction() {
  console.log('start');
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT 1 as val');
    console.log(rows); //[ {val: 1}, meta: ... ]
    console.log('end of 1 query');
    const res = await conn.query('INSERT INTO myTable value (?, ?)', [
      1,
      'mariadb'
    ]);
    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
    console.log('end of 2 query');
  } catch (err) {
    throw err;
  } finally { 
    console.log('end of function');
    if (conn) return conn.end();
  }
}
asyncFunction();