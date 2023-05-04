
import { request } from '@/utils/request';

export const authGetInforByToken = async (token: string): Promise<any> => {

    let infor = await request({
        url: "https://rrai.idns.link/api/auth/get_infor_by_token",
        headers: {
            'Authorization': token
        }
    });

    console.log(infor);
    if (infor && infor.status === 200) {
        return infor.data;
    } else {
        return null;
    }
}