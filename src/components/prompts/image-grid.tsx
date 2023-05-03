import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { civitaiQueryImages } from '@/services/civitai-service';
import { lexicaArtQueryImages } from '@/services/lexica-service';
import { PromptImageEntity, ResponseEntity, MetaEntity } from '@/services/types';
import useDimensions from 'react-use-dimensions';

import PhotoAlbum from "@/components/react-photo-album/index";
import { PhotoProvider, PhotoView } from '@/components/react-photo-view/index';

import styles from './image-grid.less';

export interface ImageGridProps {

}

export const PromptsImageGrid: React.FC<ImageGridProps> = ({ }) => {

    const [ref, { x, y, width, height }] = useDimensions();

    const [items, setItems] = useState<Array<PromptImageEntity>>([]);

    const [meta, setMeta] = useState<MetaEntity>({
        currentPage: 0,
        nextPage: "",
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const refresh = async () => {

        let res = await lexicaArtQueryImages({}, '');
        console.log(res);
        setItems(res.items);
        setMeta(res.metadata);
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <div className={classnames(styles.container)} ref={ref}>
            {/* <PhotoProvider>
                <div className={classnames(styles.image_list)}>
                    {
                        items && items.map((item, index) => {
                            return (
                                <PhotoView width={item.width * 0.2} height={item.height * 0.2} key={index} src={`https://image.lexica.art/sm2/${item.id}`}>
                                    <img alt="img2" width={item.width * 0.2} height={item.height * 0.2} src={`https://image.lexica.art/sm2/${item.id}`} />
                                </PhotoView>
                            );
                        })
                    }
                </div>
            </PhotoProvider> */}
            <PhotoProvider>
                <div className={classnames(styles.image_list)}>
                    <PhotoAlbum layout={"masonry"} photos={items.map((item, index) => {
                        return {
                            ...item,
                            src: `https://image.lexica.art/sm2/${item.id}`,
                            width: item.width * 0.1,
                            height: item.height * 0.1,
                        };
                    })}
                        renderPhoto={(options) => {
                            console.log(options);
                            const { imageProps, layout, layoutOptions, photo, renderDefaultPhoto, wrapperStyle } = options;
                            const { src, alt, srcSet, sizes, style: unwrappedStyle, ...rest } = imageProps;
                            return (
                                <PhotoView src={src}>
                                    <img
                                        alt={alt}
                                        {...(srcSet ? { srcSet, sizes } : null)}
                                        src={src}
                                        style={unwrappedStyle}
                                        {...rest}
                                    />
                                </PhotoView>
                            );
                        }} />
                </div>
            </PhotoProvider>
        </div>
    );
};

export default PromptsImageGrid;