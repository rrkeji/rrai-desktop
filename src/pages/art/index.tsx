
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Button, Divider, Empty, RadioChangeEvent } from 'antd';
import { datasetRowsSearchByModelId } from '@/tauri/idns/index';
import { Input, Radio, Card, Typography, Tabs, Skeleton, Pagination, Spin } from 'antd';
import { ipfsStringContentByCid } from '@/tauri/idns/index';
// import { ActivityContentItem, ActivityDefaultViewer } from '@/components/activity/viewer/default-viewer';
import { Text2ImagePainterViewer, Video2AnimationPainterViewer } from '@/components/painter/index';

const { Title, Paragraph } = Typography;

import HPG_PNG from '@/assets/hbg.png';

const { Search } = Input;

import styles from './index.less';

const MODEL_ID_MAP: { [key: string]: string } = {
    'activity': 'b797fb561b9243aeba5cde4b763d501a'
};

export default function ArtPage() {

    const [active, setActive] = useState<'txt2img' | 'img2img' | 'video2animation'>('video2animation');

    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div className={classnames(styles.container)}>
            <div data-tauri-drag-region className={classnames(styles.header)}>
                <div data-tauri-drag-region className={classnames(styles.left)}>
                    <Radio.Group
                        options={[
                            { label: '文生图', value: 'txt2img' },
                            { label: '图生图', value: 'img2img', disabled: true },
                            { label: '视频生动漫', value: 'video2animation' },
                        ]}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            setActive(value);
                        }}
                        value={active}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div data-tauri-drag-region className={classnames(styles.center)}>

                </div>
                <div data-tauri-drag-region className={classnames(styles.right)}>

                </div>
            </div>
            <div className={classnames(styles.content)}>
                {
                    active === 'txt2img' && (
                        <Text2ImagePainterViewer></Text2ImagePainterViewer>
                    )
                }
                {
                    active === 'video2animation' && (
                        <Video2AnimationPainterViewer></Video2AnimationPainterViewer>
                    )
                }
            </div>
        </div>
    );
}

