import { SQLite } from '@/tauri/sqlite/index';
import { CONVERSATION_DB_NAME, MessageEntity } from '@/databases/conversation/index';
import { getUuid } from '@/utils';
import { queryConversationByUid } from './conversation-service';

import { ipfsCreateWithContent, datasetCreateByModelId, datasetCreateRow, ipfsCreateWithBytesContent, ipfsCreateWithLocalFile } from '@/tauri/index';

import { defaultChatModelId, ChatModels, ChatModelId, defaultSystemPurposeId, SystemPurposeId, SystemPurposes } from '@/databases/data/index'

const db = new SQLite(CONVERSATION_DB_NAME);

export const getMessageByConversationId = async (conversationUid: string): Promise<{ total: number, data: Array<MessageEntity> }> => {

    console.log('getMessageByConversationId.....');

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,conversation_uid,conversation_category,sender_type,sender_id,avatar,bot_role,model_id,model_options,text,typing,purpose_id,tokens_count,is_shared,shared_message_id,created,updated FROM messages WHERE conversation_uid=:conversation_uid order by created asc", {
        ":conversation_uid": conversationUid
    });

    console.log(rows, 'getMessageByConversationId');

    let data = rows.map((item, index) => {

        let message: MessageEntity = {
            id: item.id,
            senderType: item.sender_type,
            senderId: item.sender_id,
            avatar: item.avatar,
            botRole: item.bot_role,
            modelId: item.model_id,
            modelOptions: item.model_options,
            text: item.text,
            typing: item.typing,
            purposeId: item.purpose_id,
            cacheTokensCount: item.tokens_count,
            is_shared: item.is_shared,
            shared_message_id: item.shared_message_id,
            created: item.created,
            updated: item.updated,
        };

        return message;
    });
    return {
        total: rows.length,
        data: data
    };
}

export const getLastMessageByConversationId = async (conversationUid: string): Promise<MessageEntity | null> => {

    console.log('getMessageByConversationId.....');

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,conversation_uid,conversation_category,sender_type,sender_id,avatar,bot_role,model_id,model_options,text,typing,purpose_id,tokens_count,is_shared,shared_message_id,created,updated FROM messages WHERE conversation_uid=:conversation_uid order by id desc limit 0,1", {
        ":conversation_uid": conversationUid
    });

    console.log(rows, 'getMessageByConversationId');
    if (rows && rows.length > 0) {
        let data = rows.map((item, index) => {

            let message: MessageEntity = {
                id: item.id,
                senderType: item.sender_type,
                senderId: item.sender_id,
                avatar: item.avatar,
                botRole: item.bot_role,
                modelId: item.model_id,
                modelOptions: item.model_options,
                text: item.text,
                typing: item.typing,
                purposeId: item.purpose_id,
                is_shared: item.is_shared,
                shared_message_id: item.shared_message_id,
                cacheTokensCount: item.tokens_count,
                created: item.created,
                updated: item.updated,
            };

            return message;
        });
        return data[0];
    } else {
        return null;
    }
}


export const createMessage = async (conversationUid: string, conversationType: string,
    senderType: 'You' | 'Bot' | 'Person' | 'system', senderId: string, botRole: 'assistant' | 'system' | 'user', modelId: string, modelOptions: { [key: string]: any },
    text: string, typing: string, purposeId: string, avatar?: string): Promise<boolean> => {


    let res = await db.execute(`INSERT INTO messages (conversation_uid,conversation_category,sender_type,sender_id,avatar,bot_role,model_id,model_options,text,typing,purpose_id,tokens_count)VALUES (:conversation_uid,:conversation_category,:sender_type,:sender_id,:avatar,:bot_role,:model_id,:model_options,:text,:typing,:purpose_id,:tokens_count)`, {
        ":conversation_uid": conversationUid,
        ":conversation_category": conversationType,
        ":sender_type": senderType,
        ":sender_id": senderId,
        ":avatar": avatar || "",
        ":bot_role": botRole,
        ":model_id": modelId,
        ":model_options": modelOptions ? JSON.stringify(modelOptions) : "{}",
        ":text": text,
        ":typing": typing,
        ":purpose_id": purposeId,
        ":tokens_count": 0,
    });

    console.log(res);
    return true;
}

export const updateMessageTextById = async (id: number, text: string) => {

    let res = await db.execute(`UPDATE messages SET text = :text where id = :id`, {
        ":id": id,
        ":text": text,
    });
    console.log(res);
}

export const deleteMessageById = async (id: number) => {

    let res = await db.execute(`delete from messages where id = :id`, {
        ":id": id,
    });
    console.log(res);
}

export const queryMessageById = async (id: number): Promise<MessageEntity | null> => {

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,conversation_uid,conversation_category,sender_type,sender_id,avatar,bot_role,model_id,model_options,text,typing,purpose_id,tokens_count,is_shared,shared_message_id,created,updated FROM messages WHERE  id=:id", {
        ":id": id
    });

    console.log(rows);
    if (rows && rows.length > 0) {
        let item = rows[0];

        let message: MessageEntity = {
            id: item.id,
            senderType: item.sender_type,
            senderId: item.sender_id,
            avatar: item.avatar,
            botRole: item.bot_role,
            modelId: item.model_id,
            modelOptions: item.model_options,
            text: item.text,
            typing: item.typing,
            purposeId: item.purpose_id,
            cacheTokensCount: item.tokens_count,
            is_shared: item.is_shared,
            shared_message_id: item.shared_message_id,
            created: item.created,
            updated: item.updated,
        };

        return message;
    } else {
        return null;
    }
}

export const createChatMessage = async (conversationUid: string, conversationType: string, botRole: 'assistant' | 'system' | 'user', text?: string): Promise<boolean> => {
    //通过会话 ID 查询会话相关的信息
    let conversation = await queryConversationByUid(conversationUid);
    console.log(conversation);
    if (!conversation) {
        return false;
    }

    if (!text && botRole != 'system') {
        //text为必填项
        return false;
    }
    console.log('createChatMessage');

    let modelOptions = conversation?.args;

    let modelId = modelOptions['model'];
    let purposeId = modelOptions['purposeId'];
    let customMessage = modelOptions['customMessage'];
    let conversationAvatar = conversation.avatar;

    let senderType: 'You' | 'Bot' | 'Person' | 'system' = 'You';
    if (botRole === 'system') {
        //系统消息的处理
        if (purposeId != 'Custom') {
            text = SystemPurposes[purposeId as SystemPurposeId]?.systemMessage
        } else {
            text = customMessage;
        }
        senderType = 'system';
    } else if (botRole === 'assistant') {
        senderType = 'Bot';
    }

    if (!text) {
        return false;
    }
    console.log('createChatMessage2');

    let senderId = "";
    let avatar = "";
    let typing: string = 'false';

    return await createMessage(conversationUid, conversationType, senderType, senderId, botRole, modelId, modelOptions, text, typing, purposeId, avatar);
}

export const createTaskMessage = async (conversationUid: string, ability: string, args: { [key: string]: any }, taskType: string, taskId: string): Promise<boolean> => {
    //通过会话 ID 查询会话相关的信息
    let conversation = await queryConversationByUid(conversationUid);
    console.log(conversation);
    if (!conversation) {
        return false;
    }

    if (!ability) {
        //ability为必填项
        return false;
    }
    console.log('createTaskMessage');

    let senderType: 'You' | 'Bot' | 'Person' | 'system' = 'You';
    let avatar = "";
    let typing: string = 'false';

    return await createMessage(conversationUid, 'painter', senderType, taskId, 'user', ability, args, '', typing, taskType, avatar);
}

export const updateTaskMessage = async (id: number, result: string, completed: string) => {

    let res = await db.execute(`UPDATE messages SET text = :text, typing = :typing where id = :id`, {
        ":id": id,
        ":text": result,
        ":typing": completed,
    });
    console.log(res);

    return;
}


export const deleteMessagesByConversationUid = async (uid: string): Promise<boolean> => {


    //删除会话下所有的消息
    let res1 = await db.execute("delete from messages where conversation_uid = :uid", {
        ":uid": uid
    });

    return true;
}


export const clearMessagesByConversationUid = async (uid: string): Promise<boolean> => {

    //删除会话下所有的消息
    let res1 = await db.execute("delete from messages where conversation_uid = :uid and bot_role != 'system' ", {
        ":uid": uid
    });

    return true;
}


const SD_IMAGE_MODEL_ID = '35ad567c69254adeb6f27ffbdc289593';

export const shareSdMessage = async (id: number, template: string): Promise<{ result: boolean, message: string }> => {

    //查询该信息的内容
    let msg = await queryMessageById(id);

    if (msg == null) {
        //
        return {
            result: false,
            message: "数据错误,没有找到该消息!"
        };
    }
    //msg.text
    let images = [];
    try {
        images = JSON.parse(msg.text);
    } catch (error) {
        return {
            result: false,
            message: '结果格式错误!'
        };
    }

    //上传图片
    let imageCids: Array<string> = [];
    for (let i = 0; i < images.length; i++) {
        let cid = await ipfsCreateWithLocalFile([".rrai", "datasets", SD_IMAGE_MODEL_ID, msg.senderId],
            images[i],
            "image/png",
            `image_${i}.png`,
            "dataset");
        console.log(cid);
        imageCids.push(cid);
    }
    let options: any = JSON.parse(msg.modelOptions);
    //保存信息到IPFS中
    let cid = await ipfsCreateWithContent([".rrai", "datasets", SD_IMAGE_MODEL_ID, msg.senderId],
        JSON.stringify({
            "prompts": options.prompts,
            "negative_prompt": options.negative_prompt,
            "steps": options.steps,
            "batch_size": options.batch_size,
            "results": imageCids,
        }),
        "application/json",
        'sd.json',
        "dataset");
    console.log(cid);

    //获取datasetId
    let datasetId = await datasetCreateByModelId(SD_IMAGE_MODEL_ID);
    console.log(datasetId);
    //创建dataset row
    let rowId = await datasetCreateRow(datasetId, cid, `,`);
    console.log(rowId);

    let res = await db.execute(`UPDATE messages SET is_shared = :is_shared, shared_message_id = :shared_message_id where id = :id`, {
        ":id": id,
        ":is_shared": 1,
        ":shared_message_id": JSON.stringify({
            "cid": cid,
            "rowId": rowId
        }),
    });
    return {
        result: true,
        message: ""
    };
}