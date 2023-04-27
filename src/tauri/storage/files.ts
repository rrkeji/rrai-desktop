
import { invoke } from '@tauri-apps/api/tauri'

export const listFiles = async (parentId: number): Promise<FileEntity[]> => {

    let res = await invoke('plugin:rrai-storage|list_files', { parentId: parentId });
    console.log(res);
    return res as FileEntity[];
}


export const listFilesByCategory = async (parentId: number, category: string, limit: number,): Promise<FileEntity[]> => {
    let res = await invoke('plugin:rrai-storage|list_files_by_category', {
        'parentId': parentId,
        'category': category
    });
    console.log(res);
    return res as FileEntity[];
}

//file_type 0 文件 1 文件夹
export const createFile = async (request: FileEntity): Promise<number> => {
    let res = await invoke('plugin:rrai-storage|insert_file', {
        'file': request,
    });
    console.log(res);
    return 0;
}

export const updateFile = async (id: number, parentId: number, fileName: string, category: string, avatar: string): Promise<number> => {

    let res = await invoke('plugin:rrai-storage|update_file', {
        'id': id,
        'parentId': parentId,
        'fileName': fileName,
        'category': category,
        'avatar': avatar
    });
    console.log(res);
    return 0;
}

export const deleteFile = async (fileId: number): Promise<boolean> => {

    let res = await invoke('plugin:rrai-storage|delete_file', {
        'id': fileId,
    });
    console.log(res);
    return true;
}

export const createDir = async (
    parentId: number,
    fileName: string,
): Promise<boolean> => {

    let res = await invoke('plugin:rrai-storage|create_dir', {
        'parentId': parentId,
        'fileName': fileName
    });
    console.log(res);
    return true;
}

export const addContent = async (data: Uint8Array): Promise<string | null> => {

    let res = await invoke('plugin:rrai-storage|ipfs_add_content', {
        'data': Array.from(data),
    });
    console.log(res);
    return res;
}

export const getContent = async (cid: string): Promise<Uint8Array | null> => {
    let res = await invoke('plugin:rrai-storage|ipfs_get_content', {
        'cid': cid,
    });
    console.log(res);
    return res;
}



export class FileEntity {
    id: number = 0;
    parent_id: number = 0;
    cid: string = '';
    is_pin: boolean = false;
    file_name: string = '';
    file_hash: string = '';
    file_type: string = '';
    category: string = '';
    avatar: string = '';
    is_dir: boolean = false;
    created_at: number = 0;
    updated_at: number = 0;

    constructor() {
    }

    setId(v: number) {
        this.id = v;
    }

    setParentId(v: number) {
        this.parent_id = v;
    }
    setCid(v: string) {
        this.cid = v;
    }
    setIsPin(v: boolean) {
        this.is_pin = v;
    }
    setFileName(v: string) {
        this.file_name = v;
    }
    setFileHash(v: string) {
        this.file_hash = v;
    }
    setFileType(v: string) {
        this.file_type = v;
    }
    setCategory(v: string) {
        this.category = v;
    }
    setAvatar(v: string) {
        this.avatar = v;
    }
    setIsDir(v: boolean) {
        this.is_dir = v;
    }
    setCreatedAt(v: number) {
        this.created_at = v;
    }
    setUpdatedAt(v: number) {
        this.updated_at = v;
    }
}
