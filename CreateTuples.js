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
ex.create = create = async function(table, tuple)
{
    let conn, result;
    const tables = {};
    tables["member"] = ["id", "password", "class", "email", "name", "phone_number"];
    tables["board"] = ["board_id", "board_class", "title", "content", "time", "id"];
    try
    {
        const values = [];
        if(!(table == "member" || table == "board"))
            throw new Error("no table");
        for (const att of tables[table]) {
            if(!tuple[att])
            {
                values.push("");
                continue;
            }
            values.push(tuple[att]);
        }
        console.log("push done, values : ");
        console.log(values);
        conn = await pool.getConnection();
        await conn.query("use kweb;");
        console.log("use kweb");
        if(table == "member")
        {
            result = await conn.query("insert into member values ?", [values]);
            console.log("insert done");
        }
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
                resolve(result);
            });
            
        }
    }
}

//read("board").then((res) => {console.log(res[0]);});
const someTuple = {};
someTuple.id = "myid"
someTuple.password = "ED64384640CF857A66AB2888E3C9C4CED13B4C812BCBBDFAE7C61E83098C62E8" //kweb
someTuple.class = 1;
someTuple.email = "email@naver.com"
someTuple.name = "tangtang";
someTuple.phone_number = "01011112222";
create("member", someTuple).then((res) => {console.log(res);});