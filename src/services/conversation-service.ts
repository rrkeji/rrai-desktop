import { SQLite } from '@/tauri/sqlite/index';
import { CONVERSATION_DB_NAME, ConversationEntity } from '@/databases/conversation/index';
import { getUuid } from '@/utils';
import { deleteMessagesByConversationUid } from './message-service';

const db = new SQLite(CONVERSATION_DB_NAME);

export const getConversationsByType = async (conversationType: string, keywords?: string): Promise<{ total: number, data: Array<ConversationEntity> }> => {

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,uid,category,name,avatar,args,created,updated FROM conversation WHERE category=:category order by id", {
        ":category": conversationType
    });

    console.log(rows);

    let data = rows.map((item, index) => {
        let conversation: ConversationEntity = {
            id: item.id,
            uid: item.uid,
            category: item.category,
            name: item.name,
            avatar: item.avatar,
            args: JSON.parse(item.args),
            created: item.created,
            updated: item.updated,
        };

        return conversation;
    });
    return {
        total: rows.length,
        data: data
    };
}


export const createConversation = async (conversationType: string, name: string, avatar?: string, options?: any): Promise<string> => {

    let uid = getUuid(false);
    console.log(conversationType, name, avatar, options);

    let res = await db.execute(`INSERT INTO conversation (uid,category,name,avatar,args)VALUES (:uid,:category,:name,:avatar,:args)`, {
        ":uid": uid,
        ":category": conversationType,
        ":name": name,
        ":avatar": avatar || "",
        ":args": options ? JSON.stringify(options) : "{}",
    });

    console.log(res);
    return uid;
}

export const updateConversationByUid = async (uid: string, conversationType: string, name: string, avatar?: string, options?: any) => {

    let res = await db.execute(`UPDATE conversation SET category = :category, name = :name, avatar = :avatar, args = :args where uid = :uid`, {
        ":uid": uid,
        ":category": conversationType,
        ":name": name,
        ":avatar": avatar || "",
        ":args": options ? JSON.stringify(options) : "{}",
    });

    console.log(res);
}


export const updateConversationNameByUid = async (uid: string, name: string) => {

    let res = await db.execute(`UPDATE conversation SET  name = :name  where uid = :uid`, {
        ":uid": uid,
        ":name": name,
    });

    console.log(res);
}


export const updateConversationArgsByUid = async (uid: string, args: any) => {

    let res = await db.execute(`UPDATE conversation SET  args = :args  where uid = :uid`, {
        ":uid": uid,
        ":args": JSON.stringify(args),
    });

    console.log(res);
}



export const queryConversationByUid = async (uid: string): Promise<ConversationEntity | null> => {

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,uid,category,name,avatar,args,created,updated FROM conversation WHERE uid=:uid order by id", {
        ":uid": uid
    });

    console.log(rows);
    if (rows && rows.length > 0) {
        let item = rows[0];

        let conversation: ConversationEntity = {
            id: item.id,
            uid: item.uid,
            category: item.category,
            name: item.name,
            avatar: item.avatar,
            args: JSON.parse(item.args),
            created: item.created,
            updated: item.updated,
        };

        return conversation;
    } else {
        return null;
    }
}

export const deleteConversation = async (uid: string): Promise<boolean> => {
    //删除会话
    let res1 = await db.execute("delete from conversation where uid = :uid", {
        ":uid": uid
    });
    //删除会话下所有的消息
    let res2 = await deleteMessagesByConversationUid(uid);

    return true;
}
