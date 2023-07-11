import { SQLite } from '@/tauri/sqlite/index';
import { TASKS_DB_NAME, LocalTaskEntity } from '@/databases/task/index';
import { getUuid } from '@/utils';
import { queryConversationByUid } from './conversation-service';

import { ipfsCreateWithContent, datasetCreateByModelId, datasetCreateRow, ipfsCreateWithBytesContent, ipfsCreateWithLocalFile } from '@/tauri/index';

const db = new SQLite(TASKS_DB_NAME);

export const getLocalTasksByTaskType = async (taskType: string, ability: string, page: number, pageSize: number): Promise<{ total: number, data: Array<LocalTaskEntity> }> => {

    console.log('getLocalTasksByTaskType.....');
    //总数
    const count_rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT  count(1) FROM tasks WHERE task_type = :task_type AND ability = :ability order by created asc limit 0,1", {
        ":task_type": taskType,
        ":ability": ability,
    });
    console.log(count_rows, 'getLocalTasksByTaskType');

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,category,task_type,request_task_id,name,ability,args,result_code,result,cover_image,stdout,stderr,progress,is_shared,shared_message_id,status,created,updated FROM tasks WHERE task_type = :task_type AND ability = :ability order by created asc limit :size, :page_size", {
        ":task_type": taskType,
        ":ability": ability,
        ":size": (page - 1) * pageSize,
        ":page_size": pageSize
    });

    console.log(rows, 'getLocalTasksByTaskType');

    let data = rows.map((item, index) => {

        let message: LocalTaskEntity = {
            id: item.id,
            category: item.category,
            task_type: item.task_type,
            request_task_id: item.request_task_id,
            name: item.name,
            ability: item.ability,
            args: item.args,
            result_code: item.result_code,
            result: item.result,
            cover_image: item.cover_image,
            stdout: item.stdout,
            stderr: item.stderr,
            progress: item.progress,
            status: item.status,
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

export const getLastLocalTaskByTaskType = async (taskType: string, ability: string,): Promise<LocalTaskEntity | null> => {

    console.log('getLastLocalTaskByTaskType.....');

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,category,task_type,request_task_id,name,ability,args,result_code,result,cover_image,stdout,stderr,progress,is_shared,shared_message_id,status,created,updated FROM tasks WHERE task_type = :task_type AND ability = :ability order by id desc limit 0,1", {
        ":task_type": taskType,
        ":ability": ability,
    });

    console.log(rows, 'getLastLocalTaskByTaskType');

    if (rows && rows.length > 0) {
        let data = rows.map((item, index) => {

            let message: LocalTaskEntity = {
                id: item.id,
                category: item.category,
                task_type: item.task_type,
                request_task_id: item.request_task_id,
                name: item.name,
                ability: item.ability,
                args: item.args,
                result_code: item.result_code,
                result: item.result,
                cover_image: item.cover_image,
                stdout: item.stdout,
                stderr: item.stderr,
                progress: item.progress,
                status: item.status,
                is_shared: item.is_shared,
                shared_message_id: item.shared_message_id,
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


export const createLocalTask = async (taskType: string, ability: string, args: string, requestTaskId: string, name: string): Promise<boolean> => {

    let res = await db.execute(`INSERT INTO tasks (task_type,ability,args,request_task_id,name)VALUES (:task_type,:ability,:args,:request_task_id,:name)`, {
        ":task_type": taskType,
        ":ability": ability,
        ":args": args,
        ":request_task_id": requestTaskId,
        ":name": name,
    });

    console.log(res);
    return true;
}

export const updateLocalTaskResult = async (id: number, result_code: number, result: string, cover_image: string, status: number) => {

    let res = await db.execute(`UPDATE tasks SET result_code = :result_code,result = :result,cover_image = :cover_image,status = :status where id = :id`, {
        ":id": id,
        ":result_code": result_code,
        ":result": result,
        ":cover_image": cover_image,
        ":status": status,
    });
    console.log(res);
}

export const deleteLocalTaskById = async (id: number) => {

    let res = await db.execute(`delete from tasks where id = :id`, {
        ":id": id,
    });
    console.log(res);
}

export const queryLocalTaskById = async (id: number): Promise<LocalTaskEntity | null> => {

    const rows = await db.queryWithArgs<Array<{ [key: string]: any }>>("SELECT id,category,task_type,request_task_id,name,ability,args,result_code,result,cover_image,stdout,stderr,progress,is_shared,shared_message_id,status,created,updated FROM tasks WHERE  id=:id", {
        ":id": id
    });

    console.log(rows);
    if (rows && rows.length > 0) {
        let item = rows[0];

        let message: LocalTaskEntity = {
            id: item.id,
            category: item.category,
            task_type: item.task_type,
            request_task_id: item.request_task_id,
            name: item.name,
            ability: item.ability,
            args: item.args,
            result_code: item.result_code,
            result: item.result,
            cover_image: item.cover_image,
            stdout: item.stdout,
            stderr: item.stderr,
            progress: item.progress,
            status: item.status,
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

export const deleteLocalTasksByTaskType = async (taskType: string, ability: string): Promise<boolean> => {

    //删除
    let res1 = await db.execute("delete from tasks where task_type = :task_type AND ability = :ability", {
        ":task_type": taskType,
        ":ability": ability,
    });

    return true;
}




const SD_IMAGE_MODEL_ID = '35ad567c69254adeb6f27ffbdc289593';

export const shareLocalTask = async (id: number): Promise<{ result: boolean, message: string }> => {

    //查询该信息的内容
    let msg = await queryLocalTaskById(id);

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
        images = JSON.parse(msg.result);
    } catch (error) {
        return {
            result: false,
            message: '结果格式错误!'
        };
    }

    //上传图片
    let imageCids: Array<string> = [];
    for (let i = 0; i < images.length; i++) {
        let cid = await ipfsCreateWithLocalFile([".rrai", "datasets", SD_IMAGE_MODEL_ID, msg.category],
            images[i],
            "image/png",
            `image_${i}.png`,
            "dataset");
        console.log(cid);
        imageCids.push(cid);
    }
    let options: any = JSON.parse(msg.args);
    //保存信息到IPFS中
    let cid = await ipfsCreateWithContent([".rrai", "datasets", SD_IMAGE_MODEL_ID, msg.category],
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

    let res = await db.execute(`UPDATE tasks SET is_shared = :is_shared, shared_message_id = :shared_message_id where id = :id`, {
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