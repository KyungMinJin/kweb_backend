const mariadb = require('mariadb');

let ex = module.exports = {};

const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 5
});

let create;
ex.create = create = async function(tupleObject)
{
    let conn, result;
    try
    {
        /*
        if(!())
            return new Promise((resolve, reject)=>{
                if(!result)
                    reject(new Error("Error occured"));
                resolve(result);
            });
            */
        conn = await pool.getConnection();
        await conn.query("use kweb;");
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
            /*
            return new Promise((resolve, reject)=>{
                if(!result)
                    reject(new Error("Error occured"));
                resolve(result);
            });
            */
        }
    }
}

//read("board").then((res) => {console.log(res[0]);});
