const mariadb = require('mariadb');

let ex = (module.exports = {});

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 5
});

//리턴값
//성공시 : { affectedRows: 1, updateId: 0, warningStatus: 0 }
//실패시 : undefined
let update;
ex.update = update = async function(table, tuple) {
  let conn, result;
  const tables = {};
  tables['member'] = [
    'id',
    'password',
    'class',
    'email',
    'name',
    'phone_number'
  ];
  tables['board'] = [
    'board_id',
    'board_class',
    'title',
    'content',
    'time',
    'id'
  ];
  try {
    const values = [];
    if (!(table == 'member' || table == 'board')) throw new Error('no table');
    for (const att of tables[table]) {
      if (!tuple[att]) {
        values.push('');
        continue;
      }
      values.push(tuple[att]);
    }
    console.log('push done, values : ');
    console.log(values);
    conn = await pool.getConnection();
    await conn.query('use kweb;');
    console.log('use kweb');
    const id = values[0];
    const password = values[1];
    const class_name = values[2];
    const email = values[3];
    const name = values[4];
    const phone_number = values[5];
    const sql =
      'UPDATE member SET password=?, class=?, email=?, name=?, phone_number=? WHERE id=?';
    if (table == 'member') {
      result = await conn.query(sql, [
        password,
        class_name,
        email,
        name,
        phone_number,
        id
      ]);

      console.log('update done');
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      await conn.end();

      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }
  }
};

const someTuple = {};
//SQL injection test
//someTuple.id = "myid\'; update into member values (\"fake\"," +
//    "\"ED64384640CF857A66AB2888E3C9C4CED13B4C812BCBBDFAE7C61E83098C62E8\", 0," +
//    "\"root@root.com\", \"fakename\", \"00011112222\");"
someTuple.id = 'anotherid';
someTuple.password = 'b'; //kweb
someTuple.class = 7;
//someTuple.email = "e@n.c\",\"noname\"";
someTuple.email = 'b@naver.com';
//someTuple.name = ";describe member;";
someTuple.name = 'bbbb';
someTuple.phone_number = 'bbbb';
/*
update('member', someTuple).then(res => {
  console.log(res);
});*/
