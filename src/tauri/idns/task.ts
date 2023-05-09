import { invoke } from '@tauri-apps/api/tauri'

export const publishTask = async (name: string, taskType: string, model: string,
    modelArgs: string, description: string, assignStrategy: string,
    reward: number): Promise<any> => {
    //查看token是否设置

    let res = await invoke('plugin:rrai-idns|tasks_task_publish', {
        name: name,
        taskType: taskType,
        model: model,
        modelArgs: modelArgs,
        description: description,
        assignStrategy: assignStrategy,
        reward: reward,
    });
    console.log(res);
    return res;
}

export const takeTask = async (peerId: string, env: string, abilities: Array<string>,): Promise<any> => {
    //查看token是否设置

    let res = await invoke('plugin:rrai-idns|tasks_task_take', {
        peerId: peerId,
        env: env,
        abilities: abilities,
    });
    console.log(res);
    return res;
}


export const saveTaskProcessResult = async (taskId: number, processId: number, progress: number, resultCode: number, result: string): Promise<any> => {
    //查看token是否设置

    let res = await invoke('plugin:rrai-idns|tasks_task_process_result', {
        taskId: taskId,
        processId: processId,
        progress: progress,
        resultCode: resultCode,
        result: result,
    });
    console.log(res);
    return res;
}
