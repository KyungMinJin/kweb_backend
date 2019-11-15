const mariadb = require('mariadb')

const ex = module.exports = {};

const pool = mariadb.createPool
({
    host: 'localhost',
    user: 'root',
    password: 'root',
    connectionLimit: 5
});

/* ex.delete(table, tuple)

table <String>
tuple <Object>
Returns: <Promise>

A valid tuple for table [member] must have property [id].
A valid tuple for table [board] must have property [board_id].
 */
ex.delete = async function(table, tuple)
{
    let conn, result;
    
    try
    {
        // handle invalid query
        if (!(table == 'member' || table == 'board'))
        {
           throw new Error('invalid table name');
        }
        else
        {
            if ((table == 'member') && !tuple.id)
            {
                throw new Error('invalid delete condition for member');
            }
            else if ((table == 'board') && !tuple.board_id)
            {
                throw new Error('invalid delete condition for board');
            }
        }
        
        // delete from table
        conn = await pool.getConnection();
        await conn.query('USE kweb;');
        if (table == 'member')
        {
            result = {
                message: `delete member [id: ${tuple.id}] complete`,
                board: await conn.query('DELETE FROM board WHERE id=?', tuple.id),
                member: await conn.query('DELETE FROM member WHERE id=?', tuple.id),
            };
        }
        if (table == 'board')
        {
            result = {
                message: `delete board [board_id: ${tuple.board_id}] complete`,
                board: await conn.query('DELETE FROM board WHERE board_id=?', tuple.board_id),
            };
	    }
    }
    catch (error)
    {
        throw error;
    }
    finally
    {
        if (conn)
        {
            await conn.end();
	        
            return new Promise((resolve, reject)=>{
                if (table == 'member' && (!result.board || !result.member))
                {
                    reject(new Error('Error occured while deleting from member!'));
                }
                else if (table == 'board' && !result.board)
                {
                    reject(new Error('Error occured while deleting from board!'));
                }
                resolve(result);
            });
        }
    }
}

/* test case

const invalidMember = {
    password: 'b',
    name: 'b'
};
const validMember = {
    id: 'd',
    class: 1,
    name: 'd'
}
const invalidBoard = {
    title: 'b',
    content: 'b'
}
const validBoard = {
    board_id: '3',
    title: 'c',
    id: 'c'
}

ex.delete('randomtable').then((res) => {console.log(res);}).catch((res) => {console.log(res);});
ex.delete('member', invalidMember).then((res) => {console.log(res);}).catch((res) => {console.log(res);});
ex.delete('member', validMember).then((res) => {console.log(res);}).catch((res) => {console.log(res);});
ex.delete('board', invalidBoard).then((res) => {console.log(res);}).catch((res) => {console.log(res);});
ex.delete('board', validBoard).then((res) => {console.log(res);}).catch((res) => {console.log(res);});
*/
