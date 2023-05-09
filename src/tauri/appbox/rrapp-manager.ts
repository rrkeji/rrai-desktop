
import { invoke } from '@tauri-apps/api/tauri'

export const rrappDownload = async (applicationCid: string): Promise<boolean> => {

    let res = await invoke('plugin:rrai-ability|auto_scan', {});
    console.log(res);
    return res as boolean;
}
