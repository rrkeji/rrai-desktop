import React, { useState } from 'react';
import classnames from 'classnames';
import { Button, Card, Carousel } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import useDimensions from 'react-use-dimensions';
import {
    ButtonBack, ButtonFirst, ButtonLast, ButtonNext,
    CarouselProvider, DotGroup, ImageWithZoom, Slide, Slider, Image
} from 'pure-react-carousel';

import 'pure-react-carousel/dist/react-carousel.es.css';

import { ConversationEntity, MessageEntity } from '@/databases';

import styles from './carousel-viewer.less';

export interface ImageCarouselViewerProps {
    className?: string
    conversationId: string;
    conversation: ConversationEntity
}

const images = [
    {
        src: 'https://image.lexica.art/full_jpg/3f298d37-9a69-459a-8f4e-ac7e0c9e9a3b'
    },
    {
        src: 'https://image.lexica.art/full_jpg/118caf2c-37e3-416f-b375-2ff310aa7453'
    },
    {
        src: 'https://image.lexica.art/full_jpg/ec0d3462-b54e-4a61-a9b1-427d4b26d656'
    },
    {
        src: 'https://image.lexica.art/full_jpg/8eabd0b1-6bd1-460a-b6d5-2b7da7c51cd3'
    },
];

// hasMasterSpinner

export const ImageCarouselViewer: React.FC<ImageCarouselViewerProps> = ({ className }) => {

    const [ref, { x, y, width, height }] = useDimensions();

    const [current, setCurrent] = useState<number>(0);


    console.log(width * 0.98 - 40, height * 0.96 - 120);

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.grid)} ref={ref}>
                <Card className={classnames(styles.card)}>
                    <CarouselProvider
                        visibleSlides={1}
                        totalSlides={4}
                        naturalSlideWidth={width * 0.98 - 20}
                        naturalSlideHeight={height * 0.98 - 100}
                    >
                        <div className={styles.slider_container}>
                            <Slider>
                                {
                                    images && images.map((item, index) => {
                                        return (
                                            <Slide key={index} index={index}>
                                                <div className={classnames(styles.image_item)} style={{ width: `${width * 0.98 - 20}px`, height: `${height * 0.98 - 100}px` }}>
                                                    <Image src={item.src}></Image>
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
                        <DotGroup className={classnames(styles.dot_group)} renderDots={(props) => {
                            console.log(props)
                            return (
                                <>
                                    {
                                        images && images.map((item, index) => {
                                            return (
                                                <div key={index} className={classnames(styles.dot_item)} >
                                                    <img className={classnames(styles.dot_item_image)} src={item.src}></img>
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            );
                        }} />
                    </CarouselProvider>
                </Card>
            </div>
            <div className={classnames(styles.toolbar)}>
                <Card className={classnames(styles.card)}>
                    <Button>分享</Button>
                    <Button>分享</Button>
                </Card>
            </div>
        </div>
    );
};

export default ImageCarouselViewer;