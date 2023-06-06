
import {
    FileEntity as StorageFileEntity, listFiles, listFilesByCategory,
    createDir as createLocalDir,

} from '@/tauri/storage/index';

import { ipfsPinFilesSearch, } from '@/tauri/idns/index';

export interface FileEntity {
    id: number;
    parentId: number;
    fileName: string;
    category: string;
    fileHash: string;
    fileSize: number;
    fileType: string;
    isDir: boolean;
}

export class FileProvider {

    private providerType: 'local' | 'cloud';

    constructor(type: 'local' | 'cloud') {
        this.providerType = type;
    }

    getProviderType(): 'local' | 'cloud' {
        return this.providerType;
    }

    async listFiles(parentId: number, options: { [key: string]: any }): Promise<FileEntity[]> {

        if (this.providerType === 'local') {
            return await _localListFiles(parentId, options);
        } else if (this.providerType === 'cloud') {
            return await _ipfsPinsListFiles(parentId, options);
        } else {
            return [];
        }
    }

    async createDir(parentId: number, dirName: string): Promise<boolean> {
        if (this.providerType === 'local') {
            return await createLocalDir(parentId, dirName);
        } else {
            return true;
        }
    }

    async deleteFile(id: number): Promise<{ result: boolean, message: string }> {

        return {
            result: true,
            message: ''
        };
    }

}

async function _localListFiles(parentId: number, options: { [key: string]: any }): Promise<FileEntity[]> {

    let res = await listFiles(parentId);
    console.log(res, 'listFiles');
    if (res && res.length > 0) {
        return res.map((item: StorageFileEntity, index) => {

            return {
                id: item.id,
                parentId: item.parent_id,
                fileName: item.file_name,
                category: item.category,
                fileHash: item.file_hash,
                fileSize: 0,
                fileType: item.file_type,
                isDir: item.is_dir
            };
        }).sort((item1: any, item2: any) => {
            let is_dir = item1.isDir ? 1 : 0;
            let is_dir2 = item2.isDir ? 1 : 0;
            if (is_dir2 !== is_dir) {
                return is_dir2 - is_dir;
            }
            return item1.id - item2.id;
        });;
    }
    return [];
}

// "avatar": "头像1",
// "category": "分类2",
// "cid": "QmdLuUuPRHpnQSV8iC4HVdpjjVF3Gsb3c3CVSR84fGXp7S",
// "created_at": 1684996077,
// "file_name": "文件名称2",
// "file_size": 0,
// "file_type": "文件类型",
// "id": 4,
// "is_dir": 0,
// "is_pin": 0,
// "parent_id": 0,
// "status": 1,
// "updated_at": 1685510324,
// "user_id": "5912088e48bc40ac84622b330e84175f"

async function _ipfsPinsListFiles(parentId: number, options: { [key: string]: any }): Promise<FileEntity[]> {

    let res = await ipfsPinFilesSearch({
        "parent_id": parentId
    }, 1, 1000);
    console.log(res, 'listFiles');
    if (res && res.data.length > 0) {
        return res.data.map((item: any, index) => {

            return {
                id: item.id,
                parentId: item.parent_id,
                fileName: item.file_name,
                category: item.category,
                fileHash: item.cid,
                fileSize: item.file_size,
                fileType: item.file_type,
                isDir: item.is_dir === 1
            };
        }).sort((item1: any, item2: any) => {
            let is_dir = item1.isDir ? 1 : 0;
            let is_dir2 = item2.isDir ? 1 : 0;
            if (is_dir2 !== is_dir) {
                return is_dir2 - is_dir;
            }
            return item1.id - item2.id;
        });;
    }
    return [];
}