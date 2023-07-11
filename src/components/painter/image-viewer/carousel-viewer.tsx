import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Button, Card, Carousel, Modal } from 'antd';
import { RightOutlined, LeftOutlined, ShareAltOutlined, DownloadOutlined } from '@ant-design/icons';
import useDimensions from 'react-use-dimensions';
import {
    ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
    CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider, Image
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { IconButton } from '@/components/buttons/index';
import { LocalTaskEntity } from '@/databases/task';
import { shareSdMessage } from '@/services/message-service';
const { confirm, info, error } = Modal;

import styles from './carousel-viewer.less';

export interface ImageCarouselViewerProps {
    className?: string
    message: LocalTaskEntity,
    images: Array<{ src: string; width: number; height: number; }>;
    onHeaderItemClick?: (command: string, args: any) => Promise<any>;
}


// hasMasterSpinner

export const ImageCarouselViewer: React.FC<ImageCarouselViewerProps> = ({ className, images, message, onHeaderItemClick }) => {

    const [ref, { x, y, width, height }] = useDimensions();

    const [current, setCurrent] = useState<number>(0);


    const [carouselElement, setCarouselElement] = useState<any>();

    useEffect(() => {
        setCarouselElement(
            <>
                <CarouselProvider
                    className={classnames(styles.carousel)}
                    visibleSlides={1}
                    totalSlides={images.length}
                    naturalSlideWidth={width * 0.98 - 20}
                    naturalSlideHeight={height * 0.98 - 100}
                >
                    <div className={styles.slider_container}>
                        <Slider>
                            {
                                images && images.map((item, index) => {

                                    let boxWidth = width * 0.98 - 20;
                                    let boxHeight = height * 0.98 - 100;

                                    let imageWidth = item.width;
                                    let imageHeight = item.height;

                                    if ((boxWidth / imageWidth) * imageHeight > boxHeight) {
                                        imageWidth = (boxHeight / imageHeight) * imageWidth;
                                        imageHeight = boxHeight;
                                    } else {
                                        imageHeight = (boxWidth / imageWidth) * imageHeight;
                                        imageWidth = boxWidth;
                                    }

                                    return (
                                        <Slide key={index} index={index}>
                                            <div className={classnames(styles.image_item)} style={{ width: `${boxWidth}px`, height: `${boxHeight}px` }}>
                                                <img style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }} src={item.src}></img>
                                            </div>
                                        </Slide>
                                    );
                                })
                            }
                        </Slider>
                        <ButtonBack className={classnames(styles.button, styles.buttonBack)}>
                            <LeftOutlined />
                        </ButtonBack>
                        <ButtonNext className={classnames(styles.button, styles.buttonNext)}>
                            <RightOutlined />
                        </ButtonNext>
                    </div>
                    <DotGroup className={classnames(styles.dot_group)} style={{ width: `${width * 0.9}px` }} renderDots={(props) => {
                        return (
                            <>
                                {
                                    images && images.map((item, index) => {
                                        return (
                                            <div key={index} className={classnames(styles.dot_item, props.currentSlide === index ? styles.current_slide : undefined)}
                                                onClick={() => {
                                                    //
                                                    console.log(props.carouselStore.setStoreState({
                                                        currentSlide: index
                                                    }));
                                                }} >
                                                <img className={classnames(styles.dot_item_image)} src={item.src}></img>
                                                <div className={classnames(styles.dot_item_mask)}></div>
                                            </div>
                                        );
                                    })
                                }
                            </>
                        );
                    }} />
                </CarouselProvider>
            </>
        );

    }, [width, height, images]);

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.top)}>
                <Button type={'link'} onClick={async () => {
                    onHeaderItemClick && await onHeaderItemClick("ShowHistory", {});
                }}>历史记录</Button>
            </div>
            <div className={classnames(styles.grid)} ref={ref}>
                <Card className={classnames(styles.card)}>
                    {carouselElement && carouselElement}
                </Card>
            </div>
            <div className={classnames(styles.toolbar)}>
                <Card className={classnames(styles.card)}>
                    <div className={classnames(styles.tool_buttons)}>
                        <IconButton className={classnames(styles.tool_button)}
                            title={"分享"}
                            icon={<ShareAltOutlined />} iconBackgroud={'#EB7D54'}
                            onClick={async () => {
                                //
                                let res = await shareSdMessage(message.id, '');
                                if (res.result) {
                                    info({
                                        title: '分享成功'
                                    })
                                } else {
                                    error({
                                        title: res.message
                                    });
                                }
                            }}
                            disabled={message.is_shared !== 1}
                        ></IconButton>
                        <IconButton className={classnames(styles.tool_button)}
                            title={"下载"}
                            icon={<DownloadOutlined />} iconBackgroud={'#A7E9BB'}
                            onClick={async () => {

                            }}
                            disabled={message.is_shared === 1}
                        ></IconButton>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ImageCarouselViewer;