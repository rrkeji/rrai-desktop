
import { invoke } from '@tauri-apps/api/tauri'

export const setContextValue = async (key: string, value: string): Promise<boolean> => {

    let res = await invoke('plugin:rrai-idns|set_context_value', { key: key, value: value });
    console.log(res);
    return res as boolean;
}



export const getContextValue = async (key: string, defaultValue?: string): Promise<string> => {

    let res = await invoke('plugin:rrai-idns|get_context_value', { key: key });
    console.log(res);
    return res as string;
}


