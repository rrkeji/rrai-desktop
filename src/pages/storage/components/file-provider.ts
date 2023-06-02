
import {
    FileEntity as StorageFileEntity, listFiles, listFilesByCategory,
    createDir as createLocalDir
} from '@/tauri/storage/index';

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
        }
        return [];
    }

    async createDir(parentId: number, dirName: string): Promise<boolean> {
        if (this.providerType === 'local') {
            return await createLocalDir(parentId, dirName);
        } else {
            return true;
        }
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