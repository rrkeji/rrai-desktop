
import { request } from '@/utils/request';
import { datasetRowsSearchOwned, datasetCreateRow, datasetRowsSearch, updateDatasetRowById } from '@/tauri/idns/dataset';
import { setLocalValue } from '@/utils';

export const authGetInforByToken = async (token: string): Promise<{ openid: string; } | '401' | 'error'> => {

    let infor = await request({
        url: "https://rrai.idns.link/api/auth/get_infor_by_token",
        headers: {
            'Authorization': token
        }
    });

    console.log(infor);
    if (infor && infor.status === 200) {
        return infor.data;
    } else if (infor && infor.status === 401) {
        return '401';
    } else {
        return 'error';
    }
}

export const getUserInfor = async (token: string): Promise<{ rowId: number; nickname: string; avatar: string; vip: number; recharge: number; checkin: string; tags: string; }> => {

    let datasetId = 'b09e227e3b6540f3913f817cb0bafbc9';
    //获取到用户的信息
    let res = await datasetRowsSearchOwned(datasetId, 1, 1);
    if (res && res.data && res.data.length >= 1) {
        let row = res.data[0];
        let userInfor = JSON.parse(row.parts);
        //
        console.log(userInfor);
        return {
            rowId: row.id,
            ...userInfor,
            tags: row.tags
        };
    } else {
        let defaultUser = {
            "nickname": "用户昵称",
            "avatar": "",
            "vip": 0,
            "recharge": 0,
            "checkin": "20220202"
        };
        //添加用户
        let rowId = await datasetCreateRow(datasetId, '', JSON.stringify(defaultUser));

        console.log(rowId);
        return {
            rowId: rowId,
            ...defaultUser,
            tags: ''
        };
    }
}

export const validateCode = async (code: string, token: string): Promise<'invalid' | 'used' | 'valid' | 'error'> => {

    let datasetId = 'e7d1cf3c9e1542d999c5159cdba1997a';
    //查询code是否有效
    let res = await datasetRowsSearch(datasetId, 1, 1, code);
    if (res && res.data.length > 0 && res.data[0].parts === code) {
        //匹配
        let userRes = await datasetRowsSearch('b09e227e3b6540f3913f817cb0bafbc9', 1, 1, undefined, code);
        console.log(userRes);
        if (userRes && userRes.data && userRes.data.length > 0 && userRes.data[0].tags === code + ',') {
            //已经被使用
            return 'used';
        } else {
            let datasetId = 'b09e227e3b6540f3913f817cb0bafbc9';
            //获取到用户的信息
            let res = await datasetRowsSearchOwned(datasetId, 1, 1);
            if (res && res.data && res.data.length >= 1) {
                let row = res.data[0];
                let userInfor = JSON.parse(row.parts);

                console.log(userInfor);
                //绑定
                userInfor.vip = 1;

                await updateDatasetRowById(row.id, '', JSON.stringify(userInfor), code + ',');
                //
                setLocalValue('rrai_nobo_vip', '1');
                return 'valid';
            } else {
                return 'error';
            }
        }
    } else {
        return 'invalid';
    }
}