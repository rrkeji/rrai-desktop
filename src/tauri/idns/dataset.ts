

import { invoke } from '@tauri-apps/api/tauri'

export const dataSetRows = async (datasetId: string, pageSize: number, page: number, parts?: string): Promise<any> => {
    //查看token是否设置

    let res = await invoke('plugin:rrai-idns|dataset_rows', {
        datasetId: datasetId,
        parts: parts,
        page: page,
        pageSize: pageSize
    });
    console.log(res);
    return res;
}


export const queryDatasetRowById = async (datasetId: string, id: number): Promise<{ [key: string]: any }> => {

    let res: any = await invoke('plugin:rrai-idns|query_dataset_row', {
        datasetId: datasetId,
        id: id,
    });
    console.log(res);
    //{"data":{"created_at":1682683351,"dataset_id":"2aaeaf42069048d99c88d440cc2fddf0","id":1,"parts":"软盘","row_cid":"QmRtim8sov5t6HGPeQMz5Cn2ECjrhwgimDPtU8zWLvspAc","status":1,"updated_at":1683333536}}
    if (typeof res === 'string') {
        res = JSON.parse(res);
    }
    return res.data;
}