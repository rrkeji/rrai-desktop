

import { invoke } from '@tauri-apps/api/tauri'

export const datasetRowsSearch = async (datasetId: string, pageSize: number, page: number, parts?: string): Promise<any> => {
    //查看token是否设置

    let res: string = await invoke('plugin:rrai-idns|dataset_rows_search', {
        datasetId: datasetId,
        parts: parts,
        page: page,
        pageSize: pageSize
    });
    //{"data":{"data":[],"page":10,"page_size":1,"total":0}} 
    let data: { data: { data: Array<any>, page: number, page_size: number, total: number } } = JSON.parse(res);
    return data.data;
}

export const datasetRowsSearchOwned = async (datasetId: string, pageSize: number, page: number, parts?: string): Promise<any> => {

    let res: string = await invoke('plugin:rrai-idns|dataset_rows_search_owned', {
        datasetId: datasetId,
        parts: parts,
        page: page,
        pageSize: pageSize
    });
    //{"data":{"data":[],"page":10,"page_size":1,"total":0}} 
    let data: { data: { data: Array<any>, page: number, page_size: number, total: number } } = JSON.parse(res);
    return data.data;
}

export const datasetRowsSearchByModelId = async (modelId: string, pageSize: number, page: number, parts?: string): Promise<any> => {

    let res: string = await invoke('plugin:rrai-idns|dataset_rows_search_by_model', {
        modelId: modelId,
        parts: parts,
        page: page,
        pageSize: pageSize
    });
    //{"data":{"data":[],"page":10,"page_size":1,"total":0}} 
    let data: { data: { data: Array<any>, page: number, page_size: number, total: number } } = JSON.parse(res);
    return data.data;
}

//string datasetId
export const datasetCreateByModelId = async (modelId: string): Promise<string> => {
    //
    let res: string = await invoke('plugin:rrai-idns|dataset_create_by_model_id', {
        modelId: modelId,
    });
    console.log(res);
    let data: { data: string } = JSON.parse(res);
    return data.data;
}

export const datasetCreateRow = async (datasetId: string, rowCid: string, parts?: string): Promise<number> => {
    //查看token是否设置
    let res: string = await invoke('plugin:rrai-idns|dataset_create_row', {
        datasetId: datasetId,
        parts: parts,
        rowCid: rowCid,
    });
    console.log(res);
    let data: { data: number } = JSON.parse(res);
    return data.data;
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