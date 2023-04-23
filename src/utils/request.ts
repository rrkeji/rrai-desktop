import { http } from "@tauri-apps/api";


export type RequestOption = {
    url: string,
    headers?: { [key: string]: any },
    method?: 'GET' | 'POST',
    dataType?: 'application/json' | 'formData'
    contentType?: 'application/json'
    data?: { [key: string]: any },
};

export const request = async (request: RequestOption): Promise<any> => {
    if (request.method === 'POST') {
        return post(request);
    } else {
        return get(request);
    }
};


export const get = async (request: RequestOption): Promise<any> => {

    return http.fetch(request.url, {
        headers: {
            ...request.headers
        },
        method: 'GET',
        query: {
            ...request.data
        }
    });
};

export const post = async (request: RequestOption): Promise<any> => {

    console.log(request);

    if (request.dataType === 'application/json') {
        return http.fetch(request.url, {
            headers: {
                ...request.headers
            },
            method: 'POST',
            body: http.Body.json(request.data != null ? request.data : {})
        });
    } else {
        return http.fetch(request.url, {
            headers: {
                ...request.headers
            },
            method: 'POST',
            body: http.Body.form(request.data != null ? request.data : {})
        });
    }

};