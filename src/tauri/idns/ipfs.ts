

import { invoke } from '@tauri-apps/api/tauri'

// 返回CID
export const ipfsCreateWithContent = async (paths: string[], content: string, fileType: string, fileName: string, category: string): Promise<string> => {
    let res: string = await invoke('plugin:rrai-idns|ipfs_files_create_with_string_content', {
        paths: paths,
        content: content,
        fileType: fileType,
        fileName: fileName,
        category: category
    });
    console.log(res);
    let data: { data: string } = JSON.parse(res);
    return data.data;
}

// 返回CID
export const ipfsCreateWithBytesContent = async (paths: string[], content: Uint8Array, fileType: string, fileName: string, category: string): Promise<string> => {
    let res: string = await invoke('plugin:rrai-idns|ipfs_files_create_with_bytes_content', {
        paths: paths,
        content: content,
        fileType: fileType,
        fileName: fileName,
        category: category
    });
    console.log(res);
    let data: { data: string } = JSON.parse(res);
    return data.data;
}

// 返回CID
export const ipfsCreateWithLocalFile = async (paths: string[], localPath: string, fileType: string, fileName: string, category: string): Promise<string> => {
    let res: string = await invoke('plugin:rrai-idns|ipfs_files_create_with_local_file', {
        paths: paths,
        content: localPath,
        fileType: fileType,
        fileName: fileName,
        category: category
    });
    console.log(res);
    let data: { data: string } = JSON.parse(res);
    return data.data;
}

export const ipfsFilesMkdirs = async (paths: string[]): Promise<any> => {
    let res = await invoke('plugin:rrai-idns|ipfs_files_mkdirs', {
        paths: paths,
    });
    console.log(res);
    return res;
}

export const ipfsStringContentByCid = async (cid: string, fileName: string): Promise<string> => {
    let res: string = await invoke('plugin:rrai-idns|ipfs_string_content', {
        cid: cid,
        fileName: fileName,
    });
    return res;
}

export const ipfsPinFilesSearch = async (conditions: { [key: string]: any }, page: number, pageSize: number)
    : Promise<{ data: Array<any>; page: number; page_size: number; total: number }> => {
    let res: string = await invoke('plugin:rrai-idns|ipfs_files_search', {
        page: page,
        pageSize: pageSize,
        conditions: conditions,
    });
    console.log(res);
    let data: { data: { data: Array<any>; page: number; page_size: number; total: number } } = JSON.parse(res);
    return data.data;
}
