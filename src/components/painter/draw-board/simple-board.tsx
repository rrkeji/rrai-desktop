import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';
import { CommonProperties } from './common';
import { StableDiffusionText2ImageArgs, StableDiffusionText2ImageArgsDefault } from '../types';
import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import styles from './simple-board.less';

export interface SimpleBoardProps {
    className?: string;
    purpose: 'figure' | 'animal' | 'scene';
    initArgs?: StableDiffusionText2ImageArgs;
    onArgsChange: (args: StableDiffusionText2ImageArgs) => Promise<any>
}


const imageStyles = [
    {
        icon: (<div>👩‍💻</div>),
        value: '漫画',
        title: '漫画'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '现实照片',
        title: '现实照片'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '赛博朋克',
        title: '赛博朋克'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '蒸汽朋克',
        title: '蒸汽朋克'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '吉卜力',
        title: '吉卜力'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '水彩',
        title: '水彩'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '插画',
        title: '插画'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '油画',
        title: '油画'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '素描',
        title: '素描'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '涂鸦',
        title: '涂鸦'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '浮世绘',
        title: '浮世绘'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '壁画',
        title: '壁画'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '像素艺术',
        title: '像素艺术'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '国画',
        title: '国画'
    }, {
        icon: (<div>👩‍💻</div>),
        value: '3D',
        title: '3D'
    }
];

const scenes = [
    {
        icon: (<div>👩‍💻</div>),
        value: '微距',
        title: '微距'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '特写 ',
        title: '特写'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '头像',
        title: '头像'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '半身照 ',
        title: '半身照'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '全身照 ',
        title: '全身照'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '低角度 ',
        title: '低角度'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '鱼眼 ',
        title: '鱼眼'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '景深 ',
        title: '景深'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '镜头光晕 ',
        title: '镜头光晕'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '航拍 ',
        title: '航拍'
    },
];

const artists = [
    {
        icon: (<div>👩‍💻</div>),
        value: '莫兰',
        title: '莫兰'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '达芬奇',
        title: '达芬奇'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '慕夏',
        title: '慕夏'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '蒙德里安',
        title: '蒙德里安'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '科尔',
        title: '科尔'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '莫奈',
        title: '莫奈'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '维米尔',
        title: '维米尔'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '伦勃朗',
        title: '伦勃朗'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '毕加索',
        title: '毕加索'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '金凯德',
        title: '金凯德'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '梵高',
        title: '梵高'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '安格尔',
        title: '安格尔'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '保罗·高更',
        title: '保罗·高更'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '齐白石',
        title: '齐白石'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '林风眠',
        title: '林风眠'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '潘天寿',
        title: '潘天寿'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '吴冠中',
        title: '吴冠中'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '丰子恺',
        title: '丰子恺'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '张大千',
        title: '张大千'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '李可染',
        title: '李可染'
    },
    {
        icon: (<div>👩‍💻</div>),
        value: '丢勒',
        title: '丢勒'
    },
];


const negativePromptsDefault = {
    'figure': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    'animal': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    'scene': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
};

export const SimpleBoard: React.FC<SimpleBoardProps> = ({ purpose, onArgsChange, initArgs }) => {

    const [commonProerties, setCommonProerties] = useState<{
        steps: number;
        batchSize: number;
        ratio: string;
    }>({
        steps: 50,
        batchSize: 2,
        ratio: "1:1",
    });
    const [prompt, setPrompt] = useState<string>('');

    const [negativePrompt, setNegativePrompt] = useState<string>(negativePromptsDefault[purpose]);

    useEffect(() => {
        if (initArgs) {
            setPrompt(initArgs.prompts);
            setNegativePrompt(initArgs.negative_prompt);
            setCommonProerties({
                steps: initArgs.steps,
                batchSize: initArgs.batch_size,
                ratio: "1:1",
            });
        }
    }, [initArgs]);

    return (
        <div className={classnames(styles.container)}>
            <Row>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画面描述</label>
                    <TextArea rows={5} value={prompt} onChange={(event) => {
                        setPrompt(event.target.value);
                        onArgsChange({
                            prompts: event.target.value,
                            negative_prompt: negativePrompt,
                            steps: commonProerties.steps,
                            batch_size: commonProerties.batchSize,
                        });
                    }}></TextArea>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>反向描述</label>
                    <TextArea rows={2} value={negativePrompt} onChange={(event) => {
                        setNegativePrompt(event.target.value);
                        onArgsChange({
                            prompts: prompt,
                            negative_prompt: event.target.value,
                            steps: commonProerties.steps,
                            batch_size: commonProerties.batchSize,
                        });
                    }}></TextArea>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>风格</label>
                    <ImageSelect
                        value={'漫画'}
                        items={imageStyles}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>镜头</label>
                    <ImageSelect
                        value={'头像'}
                        items={scenes}
                        onValueChange={(val) => {

                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>艺术家</label>
                    <ImageSelect
                        value={'达芬奇'}
                        items={artists}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <CommonProperties commonProerties={commonProerties} onChange={async (val) => {
                    console.log(val);
                    setCommonProerties(val);
                    onArgsChange({
                        prompts: prompt,
                        negative_prompt: negativePrompt,
                        steps: val.steps,
                        batch_size: val.batchSize,
                    });
                }}></CommonProperties>
            </Row>
        </div>
    );
};

export default SimpleBoard;