
import { invoke } from '@tauri-apps/api/tauri'

export const schemaByModel = async (modelId: string, version: number): Promise<any> => {

    let res = await invoke('plugin:rrai-idns|schema_by_model', { modelId: modelId, version: version });
    console.log(res);
    return res;
}


