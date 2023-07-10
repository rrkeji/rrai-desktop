import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';
import { CommonProperties } from './common';
import { StableDiffusionText2ImageArgs, StableDiffusionText2ImageArgsDefault } from '../types';
import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
import { queryKeyValues, datasetRowsSearch } from '@/tauri/idns/index';
const { TextArea } = Input;
const { Option } = Select;

import styles from './simple-board.less';

export interface SimpleBoardProps {
    className?: string;
    purpose: 'figure' | 'animal' | 'scene';
    initArgs?: StableDiffusionText2ImageArgs;
    onArgsChange: (args: StableDiffusionText2ImageArgs) => Promise<any>
}


const samplers =
    [
        {
            "name": "Euler a",
            "aliases": [
                "k_euler_a",
                "k_euler_ancestral"
            ],
            "options": {}
        },
        {
            "name": "Euler",
            "aliases": [
                "k_euler"
            ],
            "options": {}
        },
        {
            "name": "LMS",
            "aliases": [
                "k_lms"
            ],
            "options": {}
        },
        {
            "name": "Heun",
            "aliases": [
                "k_heun"
            ],
            "options": {}
        },
        {
            "name": "DPM2",
            "aliases": [
                "k_dpm_2"
            ],
            "options": {
                "discard_next_to_last_sigma": "True"
            }
        },
        {
            "name": "DPM2 a",
            "aliases": [
                "k_dpm_2_a"
            ],
            "options": {
                "discard_next_to_last_sigma": "True"
            }
        },
        {
            "name": "DPM++ 2S a",
            "aliases": [
                "k_dpmpp_2s_a"
            ],
            "options": {}
        },
        {
            "name": "DPM++ 2M",
            "aliases": [
                "k_dpmpp_2m"
            ],
            "options": {}
        },
        {
            "name": "DPM++ SDE",
            "aliases": [
                "k_dpmpp_sde"
            ],
            "options": {}
        },
        {
            "name": "DPM fast",
            "aliases": [
                "k_dpm_fast"
            ],
            "options": {}
        },
        {
            "name": "DPM adaptive",
            "aliases": [
                "k_dpm_ad"
            ],
            "options": {}
        },
        {
            "name": "LMS Karras",
            "aliases": [
                "k_lms_ka"
            ],
            "options": {
                "scheduler": "karras"
            }
        },
        {
            "name": "DPM2 Karras",
            "aliases": [
                "k_dpm_2_ka"
            ],
            "options": {
                "scheduler": "karras",
                "discard_next_to_last_sigma": "True"
            }
        },
        {
            "name": "DPM2 a Karras",
            "aliases": [
                "k_dpm_2_a_ka"
            ],
            "options": {
                "scheduler": "karras",
                "discard_next_to_last_sigma": "True"
            }
        },
        {
            "name": "DPM++ 2S a Karras",
            "aliases": [
                "k_dpmpp_2s_a_ka"
            ],
            "options": {
                "scheduler": "karras"
            }
        },
        {
            "name": "DPM++ 2M Karras",
            "aliases": [
                "k_dpmpp_2m_ka"
            ],
            "options": {
                "scheduler": "karras"
            }
        },
        {
            "name": "DPM++ SDE Karras",
            "aliases": [
                "k_dpmpp_sde_ka"
            ],
            "options": {
                "scheduler": "karras"
            }
        },
        {
            "name": "DDIM",
            "aliases": [],
            "options": {}
        },
        {
            "name": "PLMS",
            "aliases": [],
            "options": {}
        },
        {
            "name": "UniPC",
            "aliases": [],
            "options": {}
        }
    ];


const negativePromptsDefault = {
    'figure': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    'animal': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
    'scene': "nsfw, blurry, bad anatomy, ugly, disfigured, deformed, extra limbs, mutation, out of frame, poorly drawn face, poorly drawn hands, low quality, worst quality, watermark, extra legs, extra arms, mutated hands, jpeg artifacts, nude, naked, topless, nipple, bottomless,",
};

const BASE_MODEL_DATASET_ID = "46bf35665c06449b9d8a3a55a2fae31b";

export const SimpleBoard: React.FC<SimpleBoardProps> = ({ purpose, onArgsChange, initArgs }) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [baseModels, setBaseModels] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [baseModel, setBaseModel] = useState();

    //sampler_index
    const [samplerIndex, setSamplerIndex] = useState<string>('DPM++ 2S a Karras');

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

    const refresh = () => {
        setLoading(true);
        //
        queryKeyValues(BASE_MODEL_DATASET_ID).then((res) => {
            setBaseModels(res);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    };


    useEffect(() => {
        //
        refresh();
    }, []);


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
                    <label className={classnames(styles.label)}>基础模型</label>
                    <ImageSelect
                        value={'漫画'}
                        items={baseModels}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>{'风格(LoRA)'}</label>
                    <ImageSelect
                        value={'漫画'}
                        items={baseModels}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>VAE</label>
                    <ImageSelect
                        value={'漫画'}
                        items={baseModels}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
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
                    <label className={classnames(styles.label)}>{'采样器'}</label>
                    <ImageSelect
                        value={samplerIndex}
                        items={samplers.map((item) => {
                            return {
                                key: item.name,
                                data: item,
                                value: item.name
                            };
                        })}
                        onValueChange={(val) => {
                            setSamplerIndex(val)
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