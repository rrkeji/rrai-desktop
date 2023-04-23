import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { civitaiQueryImages, MetaEntity } from '@/services/civitai-service';
import { Gallery } from "../images/index";
import styles from './image-grid.less';

export interface ImageGridProps {

}

// createdAt: "2023-02-20T17:16:18.886Z"
// hash: "U6DvD,D%00^+00xu%MV?}=IV?c-p00%2x]Na"
// height: 1152
// id: 127497
// meta: {ENSD: "31337", Size: "512x768", seed: 3118275117, Model: "chilloutmix_NiPrunedFp32Fix", steps: 25, …}
// nsfw: true
// postId: 86634
// stats: {cryCount: 30, laughCount: 843, likeCount: 1282, dislikeCount: 73, heartCount: 190, …}
// url: "https://imagecache.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/27e77f3a-29c4-4cab-bcde-dd9eab587000/width=768/27e77f3a-29c4-4cab-bcde-dd9eab587000.jp…"
// username: "41e"
// width: 768

export const PromptsImageGrid: React.FC<ImageGridProps> = ({ }) => {

    const [items, setItems] = useState<Array<any>>([]);

    const [meta, setMeta] = useState<MetaEntity>({
        currentPage: 0,
        nextPage: "",
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const refresh = async () => {

        let res = await civitaiQueryImages({}, '');
        console.log(res);
        setItems(res.items);
        setMeta(res.metadata);
    };

    useEffect(() => {
        refresh();
    }, []);


    return (
        <div className={classnames(styles.container)}>
            <Gallery images={items.map((item, index) => {

                return {
                    src: item.url,
                    width: item.width,
                    height: item.height,
                };
            })} />
            {/* {
                items && items.map((item, index) => {

                    return (
                        <img src={item.url} width={item.width} height={item.height}></img>
                    );
                })
            } */}
        </div>
    );
};

export default PromptsImageGrid;