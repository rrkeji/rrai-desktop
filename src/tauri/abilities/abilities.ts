
import { invoke } from '@tauri-apps/api/tauri'

export const autoScan = async (): Promise<boolean> => {

    let res = await invoke('plugin:rrai-ability|auto_scan', {});
    console.log(res);
    return res as boolean;
}


export const listAbilities = async (): Promise<Array<any>> => {

    let res = await invoke('plugin:rrai-ability|list_abilities', {});
    console.log(res);
    return res;
}

export const updateAbilitySettings = async (ability: string, settings: any): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|update_ability_settings', {
        ability: ability,
        settings: JSON.stringify(settings)
    });
    console.log(res);
    return res;
}

export const abilityScan = async (ability: string): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|ability_scan', {
        ability: ability,
    });
    console.log(res);
    return res;
}

export const performTask = async (ability: string, args: string): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|perform_task', {
        ability: ability,
        args: args,
    });
    console.log(res);
    return res;
}

export const performTaskStdout = async (ability: string, runningTaskId: string): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|perform_task_stdout', {
        ability: ability,
        runningTaskId: runningTaskId,
    });
    console.log(res);
    return res;
}

export const performTaskStderr = async (ability: string, runningTaskId: string): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|perform_task_stderr', {
        ability: ability,
        runningTaskId: runningTaskId,
    });
    console.log(res);
    return res;
}

export const performTaskStatus = async (ability: string, runningTaskId: string, exitRemove: boolean): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|perform_task_status', {
        ability: ability,
        runningTaskId: runningTaskId,
        exitRemove: exitRemove,
    });
    console.log(res);
    return res;
}
