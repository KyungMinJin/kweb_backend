const mariadb = require('mariadb');
const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 5
});

async function createMemberTable(conn)
{
    // id, password 등의 조건은 insert할 때 처리
    // password는 sha-256으로 해싱되어 64자
    // name은 한글이 2byte이므로 varchar(10)은 5글자 저장가능
    await conn.query("create table if not exists member (id varchar(20), password char(64), " + 
    "class int, email varchar(50), name varchar(10), phone_number varchar(11), " +
    "primary key(id));");
    console.log("Create member table");
}

async function createBoardTable(conn)
{
    // 기본 board, 게시판 별로 만들어야함
    // content는 링크를 저장, 링크 주소 줄이기(bitly, google URL shortener이용)
    // 작성자 id가 외부인일경우 Guest로 저장
    await conn.query("create table if not exists board (board_id int auto_increment, board_class int, " + 
        "title varchar(80), content varchar(40), time datetime, id varchar(20), " +
        "primary key(board_id), foreign key(id) references member(id));");
    console.log("Create board table");
}

async function createKWEBDB()
{
    let conn, code;
    try
    {
        conn = await pool.getConnection();
        console.log("Initialized!");
        await conn.query("create database if not exists kweb;");
        console.log("Create kwebDB");
        await conn.query("use kweb;");
        createMemberTable(conn);
        createBoardTable(conn);
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
            await conn.end();
            process.exit(code);
        }
    }
}
createKWEBDB();