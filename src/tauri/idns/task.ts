import { invoke } from '@tauri-apps/api/tauri'

export const publishTask = async (name: string, taskType: string, model: string,
    modelArgs: string, description: string, assignStrategy: string,
    reward: number): Promise<any> => {
    //查看token是否设置
    let res: string = await invoke('plugin:rrai-idns|tasks_task_publish', {
        name: name,
        taskType: taskType,
        model: model,
        modelArgs: modelArgs,
        description: description,
        assignStrategy: assignStrategy,
        reward: reward,
    });
    console.log(res);
    let data: { data: number } = JSON.parse(res);
    return data.data;
}

export const takeTask = async (peerId: string, env: string, abilities: Array<string>,): Promise<any> => {
    //查看token是否设置
    let res: string = await invoke('plugin:rrai-idns|tasks_task_take', {
        peerId: peerId,
        env: env,
        abilities: abilities,
    });
    console.log(res);
    let data: { data: any } = JSON.parse(res);
    return data.data;
}


export const saveTaskProcessResult = async (taskId: number, processId: number, progress: number, resultCode: number, result: string): Promise<any> => {
    //查看token是否设置

    let res: string = await invoke('plugin:rrai-idns|tasks_task_process_result', {
        taskId: taskId,
        processId: processId,
        progress: progress,
        resultCode: resultCode,
        result: result,
    });
    console.log(res);
    let data: { data: any } = JSON.parse(res);
    return data.data;
}


export const qureyTaskById = async (taskId: number): Promise<any> => {
    //查看token是否设置

    let res: string = await invoke('plugin:rrai-idns|tasks_task_query_by_id', {
        taskId: taskId,
    });
    console.log(res);
    let data: { data: any } = JSON.parse(res);
    return data.data;
}
