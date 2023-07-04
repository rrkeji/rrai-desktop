
import { invoke } from '@tauri-apps/api/tauri'

export const autoScan = async (): Promise<boolean> => {

    let res = await invoke('plugin:rrai-ability|env_auto_scan', {});
    console.log(res);
    return res as boolean;
}


export const listAbilityEnvs = async (): Promise<Array<any>> => {

    let res = await invoke('plugin:rrai-ability|list_ability_envs', {});
    console.log(res);
    return res;
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

export const performTaskStatus = async (runningTaskId: string): Promise<any> => {

    let res = await invoke('plugin:rrai-ability|perform_task_status', {
        taskId: runningTaskId,
    });
    console.log(res);
    return res;
}
