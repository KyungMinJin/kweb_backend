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
ex.read = read = async function(table, tuple)
{
    let conn, result;
    const tables = {};
    tables["member"] = ["id", "password", "class", "email", "name", "phone_number"];
    tables["board"] = ["board_id", "board_class", "title", "content", "time", "id"];
    try
    {
        const values = [];
        if(!(table === "member" || table === "board"))
            throw new Error("no table");
        let readQuery = "select * from " + table + " where 1=1 ";
        for (const att of tables[table]) {
            if(!tuple[att])
            {
                continue;
            }
            readQuery += "and " + att + "=? "
            values.push(tuple[att]);
        }
        //console.log(readQuery);
        conn = await pool.getConnection();
        await conn.query("use kweb;");

        result = await conn.query(readQuery + ";", [values]);
        delete result.meta;
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

let someTuple = {};
someTuple.board_id = 500;
////read("board", someTuple).then((res) => {console.log(res);});
someTuple = {};
////read("member", someTuple).then((res) => {console.log(res);});
someTuple = {};
someTuple.id = "noidexist";
////read("member", someTuple).then((res) => {console.log(res);});