
import { request } from '@/utils/request';


export interface MetaEntity {
    currentPage: number;
    nextPage: string;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}


export const civitaiQueryImages = async (params: {}, token: string): Promise<any> => {

    let infor = await request({
        url: "http://45.207.58.161:3080/proxy/civitai/get",
        method: 'POST',
        headers: {
            'Authorization': token
        },
        dataType: 'application/json',
        data: {
            url: 'https://civitai.com/api/v1/images?nsfw=false&limit=10',
            headers: {},
            token_key: ''
        }
    });

    console.log(infor);
    if (infor && infor.status === 200) {
        return infor.data;
    } else {
        return null;
    }
}