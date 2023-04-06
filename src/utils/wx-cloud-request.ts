import { http } from "@tauri-apps/api";

const BASE_URL = 'https://rrai-29154-7-1315753304.sh.run.tcloudbase.com';

export type WxCloudRequestOption = {
    path: string,
    header?: { [key: string]: any },
    method?: 'GET' | 'POST',
    dataType?: 'application/json' | 'formData'
    data?: { [key: string]: any },
};

//"X-WX-SERVICE": "rrai"
export const wxCloudRequest = async (request: WxCloudRequestOption): Promise<any> => {

    if (!request.header) {
        request.header = {};
    }
    //TODO
    request.header['x-wx-openid'] = 'oZ3cl4xEzpiKYmL1-t-2DSGC-2j0';
    request.header['x-wx-unionid'] = 'omuRWw87l5CvZqXZfaSnesFuWePo';

    if (request.method === 'POST') {
        return post(request);
    } else {
        return get(request);
    }
};


const get = async (request: WxCloudRequestOption): Promise<any> => {

    let url = BASE_URL + request.path;

    return http.fetch(url, {
        headers: {
            ...request.header
        },
        method: 'GET',
        query: {
            ...request.data
        }
    });
};

const post = async (request: WxCloudRequestOption): Promise<any> => {
    let url = BASE_URL + request.path;

    if (request.dataType === 'application/json') {
        return http.fetch(url, {
            headers: {
                ...request.header
            },
            method: 'POST',
            body: http.Body.json(request.data != null ? request.data : {})
        });
    } else {
        return http.fetch(url, {
            headers: {
                ...request.header
            },
            method: 'POST',
            query: http.Body.form(request.data != null ? request.data : {})
        });
    }

};