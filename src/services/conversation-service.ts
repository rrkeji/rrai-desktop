import { TConversation } from '@/lib/conversation';
import { SQLite } from '@/tauri/sqlite/index';

export const getConversationsByType = async (conversationType: string): Promise<any> => {

    let data = [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
        return {
            id: item + '',
            title: '会话' + item
        } as TConversation;
    });
    return {
        total: 10,
        data: data
    };
}

export const test = async () => {

    /** The path will be 'src-tauri/test.db', you can customize the path */
    const db = await SQLite.open('./test.sqlite')

    /** execute SQL */
    await db.execute(`
    CREATE TABLE users (name TEXT, age INTEGER);
    INSERT INTO users VALUES ('Alice', 42);
`)

    /** execute SQL with params */
    await db.execute('INSERT INTO users VALUES (:name, :age)', {
        ':name': 'test',
        ':age': 19
    })

    /** batch execution SQL with params */
    // await db.execute('INSERT INTO users VALUES (?1, ?2)', [
    //     ['Allen', 20],
    //     ['Barry', 16],
    //     ['Cara', 28],
    // ])

    /** select count */
    const rows = await db.queryWithArgs<Array<{ count: number }>>('SELECT COUNT(*) as count FROM users')

    console.log(rows);
    /** select with param */
    // const rows = await db.select<Array<{ name: string }>>('SELECT name FROM users WHERE age > ?', [20])

    // /** select with params, you can use ? or $1 .. $n */
    // const rows = await db.select<Array<any>>('SELECT * FROM users LIMIT $1 OFFSET $2', [10, 0])

    /** close sqlite database */
    const isClosed = await db.close()
    console.log(isClosed);
};
