

import { invoke } from '@tauri-apps/api/tauri'

export const dataSetRows = async (datasetId: string, pageSize: number, page: number, parts?: string): Promise<any> => {

    let res = await invoke('plugin:rrai-idns|dataset_rows', {
        datasetId: datasetId,
        parts: parts,
        page: page,
        pageSize: pageSize
    });
    console.log(res);
    return res;
}
