import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';
import { CommonProperties } from './common';
import { StableDiffusionText2ImageArgs, StableDiffusionText2ImageArgsDefault } from '../types';
import { Row, Col, Input, Select, Slider, InputNumber, Divider } from 'antd';
import { queryKeyValues, datasetRowsSearch } from '@/tauri/idns/index';
const { TextArea } = Input;
const { Option } = Select;

import styles from './simple-board.less';

export interface SimpleBoardProps {
    className?: string;
    purpose: 'figure' | 'animal' | 'scene';
    initArgs: StableDiffusionText2ImageArgs;
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



const ratios = [
    {
        value: '1:1',
        title: '1:1',
    },
    {
        value: '1:2',
        title: '1:2',
    },
    {
        value: '1:3',
        title: '1:3',
    },
    {
        value: '2:3',
        title: '2:3',
    },
    {
        value: '3:4',
        title: '3:4',
    },
    {
        value: '9:16',
        title: '9:16',
    },
    {
        value: '2:1',
        title: '2:1',
    },
    {
        value: '3:1',
        title: '3:1',
    },
    {
        value: '3:2',
        title: '3:2',
    },
    {
        value: '4:3',
        title: '4:3',
    },
    {
        value: '16:9',
        title: '16:9',
    },
];

const BASE_MODEL_DATASET_ID = "46bf35665c06449b9d8a3a55a2fae31b";

const LORA_DATASET_ID = "4b42018d859446a196397aa5a59affaa";

const VAE_DATASET_ID = "6155e1c7d6cb4e84b7bbd33303fa9e35";

export const SimpleBoard: React.FC<SimpleBoardProps> = ({ purpose, onArgsChange, initArgs }) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [baseModels, setBaseModels] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [loras, setLoras] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [vaes, setVaes] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [baseModel, setBaseModel] = useState<string>('');

    const [lora, setLora] = useState<string>('');

    const [vae, setVae] = useState<string>('');

    //sampler_index
    const [samplerIndex, setSamplerIndex] = useState<string>('DPM++ 2S a Karras');

    const [values, setValues] = useState<StableDiffusionText2ImageArgs>(initArgs);

    const [prompt, setPrompt] = useState<string>('');

    const [steps, setSteps] = useState<number>(20);

    const [batchSize, setBatchSize] = useState<number>(20);

    const [negativePrompt, setNegativePrompt] = useState<string>('');

    const refresh = async () => {
        //
        let baseModels = await queryKeyValues(BASE_MODEL_DATASET_ID);
        let loras = await queryKeyValues(LORA_DATASET_ID);
        let vaes = await queryKeyValues(VAE_DATASET_ID);

        setBaseModels(baseModels);
        setLoras(loras);
        setVaes(vaes);
        if (baseModels && baseModels.length > 0) {
            setBaseModel(baseModels[0].key);
        }
        if (loras && loras.length > 0) {
            setLora(loras[0].key);
        }
        if (vaes && vaes.length > 0) {
            setVae(vaes[0].key);
        }
    };

    useEffect(() => {
        setLoading(true);
        //
        refresh().then((res) => {
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }, []);


    useEffect(() => {
        if (initArgs) {
            setValues(initArgs);
            setPrompt(initArgs.prompt);
            setNegativePrompt(initArgs.negative_prompt);
            setSamplerIndex(initArgs.sampler_index);
            setSteps(initArgs.steps);
            setBatchSize(initArgs.batch_size);
        }
    }, [initArgs]);

    useEffect(() => {
        let update: any = {};
        if (baseModel && baseModel != values.override_settings.sd_model_checkpoint) {
            update.override_settings = {
                ...values.override_settings,
                sd_model_checkpoint: baseModel
            };
        }
        if (prompt && prompt != values.prompt) {
            update.prompt = prompt;
        }
        if (negativePrompt && negativePrompt != values.negative_prompt) {
            update.negative_prompt = negativePrompt;
        }
        if (samplerIndex && samplerIndex != values.sampler_index) {
            update.sampler_index = samplerIndex;
        }
        if (steps && steps != values.steps) {
            update.steps = steps;
        }
        if (batchSize && batchSize != values.batch_size) {
            update.batch_size = batchSize;
        }
        //set
        let newValue = {
            ...values,
            ...update,
        };
        setValues(newValue);
        onArgsChange(newValue);
    }, [baseModel, prompt, negativePrompt, samplerIndex, steps, batchSize]);

    return (
        <div className={classnames(styles.container)}>
            <Row>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>基础模型</label>
                    <ImageSelect
                        value={baseModel}
                        items={baseModels}
                        onValueChange={(val) => {
                            setBaseModel(val);
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>{'风格(LoRA)'}</label>
                    <ImageSelect
                        value={lora}
                        items={loras}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画面描述</label>
                    <TextArea rows={5} value={prompt} onChange={(event) => {
                        setPrompt(event.target.value);
                    }}></TextArea>
                </Col>

                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>反向描述</label>
                    <TextArea rows={2} value={negativePrompt} onChange={(event) => {
                        setNegativePrompt(event.target.value);
                    }}></TextArea>
                </Col>
                <Divider style={{ margin: '10px 0 0 0' }}></Divider>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>VAE</label>
                    <ImageSelect
                        value={vae}
                        items={vaes}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
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
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>生成步数</label>
                    <Row>
                        <Col span={18}>
                            <Slider
                                style={{ width: '90%' }}
                                min={1}
                                max={150}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setSteps(newValue)
                                    }
                                }}
                                value={steps}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={1}
                                max={150}
                                style={{ width: '100%' }}
                                value={steps}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setSteps(newValue)
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画质</label>
                    <ImageSelect
                        value={'figure'}
                        items={[
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '普通'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '高清'
                            },
                        ]}
                        onValueChange={(val) => {

                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>比例</label>
                    <Select value={''} onChange={async (value) => {
                        //
                    }}>
                        {
                            ratios && ratios.map((item, index) => {
                                return (
                                    <Option key={index} value={item.value}>{item.title}</Option>
                                );
                            })
                        }
                    </Select>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>数量</label>
                    <Row>
                        <Col span={18}>
                            <Slider
                                style={{ width: '90%' }}
                                min={1}
                                max={8}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setBatchSize(newValue);
                                    }
                                }}
                                value={batchSize}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={1}
                                max={8}
                                style={{ width: '100%' }}
                                value={batchSize}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setBatchSize(newValue);
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default SimpleBoard;