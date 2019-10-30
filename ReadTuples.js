const mariadb = require('mariadb');

let ex = module.exports = {};

const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 5
});

let read;
ex.read = read = async function(table)
{
    let conn, result;
    try
    {
        table = await table.toString();
        if(!(table === "board" || table === "member"))
            return new Promise((resolve, reject)=>{
                if(!result)
                    reject(new Error("Error occured"));
                resolve(result);
            });
        conn = await pool.getConnection();
        await conn.query("use kweb;");
        result = await conn.query("select * from " + table);
        console.log("result length : " + result.length);
    }
    catch (err)
    {
        throw err;
    }
    finally
    {
        if (conn) 
        {
            await conn.end();
            return new Promise((resolve, reject)=>{
                if(!result)
                    reject(new Error("Error occured"));
                resolve(result);
            });
        }
    }
}

read("board").then((res) => {console.log(res[0]);});
read("member").then((res) => {console.log(res[0]);});
read("member2").then((res) => {console.log(res[0]);});
