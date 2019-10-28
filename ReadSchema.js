const mariadb = require('mariadb');
const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 5
});

async function readKWEBDB()
{
    let conn, code;
    try
    {
        conn = await pool.getConnection();
        await conn.query("use kweb;");
        code = 0;
    }
    catch (err)
    {
        code = 1
    }
    finally
    {
        if (conn) 
        {
            return await conn.end();
        }
    }
}