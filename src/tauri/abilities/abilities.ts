
import { invoke } from '@tauri-apps/api/tauri'

export const autoScan = async (): Promise<boolean> => {

    let res = await invoke('plugin:rrai-ability|auto_scan', {});
    console.log(res);
    return res as boolean;
}


export const listAbilities = async (): Promise<boolean> => {

    let res = await invoke('plugin:rrai-ability|list_abilities', {});
    console.log(res);
    return res as boolean;
}
