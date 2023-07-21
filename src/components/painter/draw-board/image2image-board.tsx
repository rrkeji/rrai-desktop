import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';
import { CommonProperties } from './common';
import { StableDiffusionImage2ImageArgs, StableDiffusionImage2ImageArgsDefault } from '../types';
import { Row, Col, Input, Select, Slider, InputNumber, Divider, Modal, Upload } from 'antd';
import { queryKeyValues, datasetRowsSearch } from '@/tauri/idns/index';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Option } = Select;

import styles from './image2image-board.less';

export interface Image2ImageBoardProps {
    className?: string;
    initArgs: StableDiffusionImage2ImageArgs;
    onArgsChange: (args: StableDiffusionImage2ImageArgs) => Promise<any>
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

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


const BASE_MODEL_DATASET_ID = "46bf35665c06449b9d8a3a55a2fae31b";

const LORA_DATASET_ID = "4b42018d859446a196397aa5a59affaa";

const VAE_DATASET_ID = "6155e1c7d6cb4e84b7bbd33303fa9e35";

export const Image2ImageBoard: React.FC<Image2ImageBoardProps> = ({ onArgsChange, initArgs }) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [baseModels, setBaseModels] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [loras, setLoras] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [vaes, setVaes] = useState<Array<{ key: string; value: string, data: any }>>([]);

    const [baseModel, setBaseModel] = useState<string>('');

    const [lora, setLora] = useState<string>('');

    const [vae, setVae] = useState<string>('');

    // 720P 1280*720 1080P 1920*1080  480P 720*480
    const [resolution, setResolution] = useState<'720P' | '480P' | '1080P'>('720P');

    const [screenDirection, setScreenDirection] = useState<'landscape' | 'vertical'>('vertical');

    const [width, setWidth] = useState<number>(720);

    const [height, setHeight] = useState<number>(1280);

    //sampler_index
    const [samplerIndex, setSamplerIndex] = useState<string>('DPM++ 2S a Karras');

    const [values, setValues] = useState<StableDiffusionImage2ImageArgs>(initArgs);

    const [prompt, setPrompt] = useState<string>('');

    const [steps, setSteps] = useState<number>(20);

    const [cfgScale, setCfgScale] = useState<number>(0.7);

    const [batchSize, setBatchSize] = useState<number>(20);

    const [negativePrompt, setNegativePrompt] = useState<string>('');

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);

    const [previewImage, setPreviewImage] = useState('');

    const [previewTitle, setPreviewTitle] = useState('');

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

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    // 720P 1280*720 1080P 1920*1080  480P 720*480
    useEffect(() => {
        let width = 1280;
        let height = 720;
        if (screenDirection === 'landscape') {
            if (resolution === '1080P') {
                width = 1920;
                height = 1080;
            } else if (resolution === '480P') {
                width = 720;
                height = 480;
            } else {
                width = 1280;
                height = 720;
            }
        } else {
            if (resolution === '1080P') {
                width = 1080;
                height = 1920;
            } else if (resolution === '480P') {
                width = 480;
                height = 720;
            } else {
                width = 720;
                height = 1280;
            }
        }
        setWidth(width);
        setHeight(height);
    }, [resolution, screenDirection]);

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
        if (width && width != values.width) {
            update.width = width;
        }
        if (height && height != values.height) {
            update.height = height;
        }
        if (cfgScale && cfgScale != values.cfg_scale) {
            update.cfg_scale = cfgScale;
        }
        //set
        let newValue = {
            ...values,
            ...update,
        };
        setValues(newValue);
        onArgsChange(newValue);
    }, [baseModel, prompt, negativePrompt, samplerIndex, steps, batchSize, width, height, cfgScale]);

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
                    <label className={classnames(styles.label)}>原图片</label>
                    <div className={classnames(styles.upload)}>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                        >
                            {fileList.length >= 1 ? null : (
                                <div className={classnames(styles.upload_button)}>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </div>
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
                {/* <Col span={24} className={classnames(styles.item)}>
                        <label className={classnames(styles.label)}>VAE</label>
                        <ImageSelect
                            value={vae}
                            items={vaes}
                            onValueChange={(val) => {
                            }}
                        ></ImageSelect>
                    </Col> */}
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
                    <label className={classnames(styles.label)}>提示词引导系数(CFG Scale)</label>
                    <Row>
                        <Col span={18}>
                            <Slider
                                style={{ width: '90%' }}
                                min={0.01}
                                max={1}
                                step={0.01}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setCfgScale(newValue)
                                    }
                                }}
                                value={cfgScale}
                            />
                        </Col>
                        <Col span={6}>
                            <InputNumber
                                min={0.01}
                                max={1}
                                step={0.01}
                                style={{ width: '100%' }}
                                value={cfgScale}
                                onChange={async (newValue: number | null) => {
                                    if (newValue != null) {
                                        setCfgScale(newValue)
                                    }
                                }}
                            />
                        </Col>
                    </Row>
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
                        value={resolution}
                        items={[
                            {
                                data: {},
                                key: '480P',
                                value: '标清(480P)'
                            },
                            {
                                data: {},
                                key: '720P',
                                value: '高清(720P)'
                            },
                            {
                                data: {},
                                key: '1080P',
                                value: '全高清(1080P)'
                            },
                        ]}
                        onValueChange={(val) => {
                            setResolution(val);
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>横竖屏</label>
                    <ImageSelect
                        value={screenDirection}
                        items={[
                            {
                                data: {},
                                key: 'landscape',
                                value: '横屏'
                            },
                            {
                                data: {},
                                key: 'vertical',
                                value: '竖屏'
                            },
                        ]}
                        onValueChange={(val) => {
                            setScreenDirection(val);
                        }}
                    ></ImageSelect>
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
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default Image2ImageBoard;