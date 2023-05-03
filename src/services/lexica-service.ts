
import { request } from '@/utils/request';
import { PromptImageEntity, MetaEntity } from '@/services/types';

//https://lexica.art/api/v1/search?q=apples
// gallery: "https://lexica.art?q=0482ee68-0368-4eca-8846-5930db866b33"
// grid: false
// guidance: 7
// height: 512
// id: "0482ee68-0368-4eca-8846-5930db866b33"
// model: "stable-diffusion"
// nsfw: false
// prompt: "cute chubby blue fruits icons for mobile game ui "
// promptid: "d9868972-dad8-477d-8e5a-4a0ae1e9b72b"
// seed: "1413536227"
// src: "https://lexica-serve-encoded-images.sharif.workers.dev/md/0482ee68-0368-4eca-8846-5930db866b33"
// srcSmall: "https://lexica-serve-encoded-images.sharif.workers.dev/sm/0482ee68-0368-4eca-8846-5930db866b33"
// width: 512

export const lexicaArtQueryImages = async (params: {}, token?: string): Promise<ResponseEntity | null> => {

    let infor = await request({
        url: "http://45.207.58.161:3080/proxy/civitai/get",
        method: 'POST',
        headers: {
            'Authorization': token
        },
        dataType: 'application/json',
        data: {
            url: 'https://lexica.art/api/infinite-prompts',
            headers: {},
            token_key: ''
        }
    });

    console.log(infor);
    if (infor && infor.status === 200) {

        return {
            meta: {} as MetaEntity,
            items: infor.data.images.map((item: any, index: number) => {
                return {
                    width: item.width,
                    height: item.height,
                    prompt: item.prompt,
                    model: item.model,
                    src: item.src,
                    srcSmall: item.srcSmall,
                    gallery: item.gallery,
                    nsfw: item.nsfw,
                    id: item.id,
                } as PromptImageEntity;
            })
        }
    } else {
        return null;
    }
}

// https://lexica.art/api/infinite-prompts  POST

// {"text":"dog","searchMode":"images","source":"search","cursor":50,"model":"lexica-aperture-v2"}