import React, { useState } from 'react';
import classnames from 'classnames';
import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import { CardSelect, ImageSelect } from '@/components/selects';
import styles from './click-board.less';

export interface ClickBoardProps {
    className?: string;
}

const figureProperties = [
    {
        "name": "头部",
        "options": [
            {
                "title": "发饰",
                "value": "发饰",
            }
        ]
    },
    {
        "name": "情绪",
        "options": [
            {
                "title": "微笑",
                "value": "微笑",
            }
        ]
    },
    {
        "name": "动作",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "服饰风格",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "上半身服饰",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "下半身服饰",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "背景",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "植物",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "体型",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "脸型",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "发型",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "头发长度",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "眼睛",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "嘴唇",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "胸部",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "腰部",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "腿部",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    },
    {
        "name": "脚部",
        "options": [
            {
                "title": "吃饭",
                "value": "吃饭",
            }
        ]
    }
]

export const ClickBoard: React.FC<ClickBoardProps> = ({ }) => {

    const [numOutputs, setNumOutputs] = useState<number>(1);

    const onNumOutputsChange = (newValue: number | null) => {
        if (newValue != null)
            setNumOutputs(newValue);
    };


    return (
        <div className={classnames(styles.container)}>
            <Row>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画质</label>
                    <CardSelect
                        value={'figure'}
                        items={[
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '人物'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '动物'
                            },
                        ]}
                        onValueChange={(val) => {
                        }}
                    ></CardSelect>
                </Col>
                {
                    figureProperties.map((item, index) => {
                        return (
                            <Col key={index} span={12} className={classnames(styles.item)}>
                                <label className={classnames(styles.label)}>{item.name}</label>
                                <Select>
                                    {
                                        item.options.map((option, index) => <Option key={index} value={option.value}>{option.title}</Option>)
                                    }
                                </Select>
                            </Col>
                        );
                    })
                }
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>艺术家</label>
                    <ImageSelect
                        value={'figure'}
                        items={[
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '莫兰'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '达芬奇'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '慕夏'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '蒙德里安'
                            },
                        ]}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>比例</label>
                    <Select>
                        <Option>1:1</Option>
                        <Option>1:2</Option>
                        <Option>4:3</Option>
                        <Option>3:4</Option>
                        <Option>16:9</Option>
                        <Option>9:16</Option>
                    </Select>
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
                    <Select>
                        <Option>1:1</Option>
                        <Option>1:2</Option>
                        <Option>4:3</Option>
                        <Option>3:4</Option>
                        <Option>16:9</Option>
                        <Option>9:16</Option>
                    </Select>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>数量</label>
                    <Row>
                        <Col span={17}>
                            <Slider
                                min={1}
                                max={20}
                                onChange={onNumOutputsChange}
                                value={typeof numOutputs === 'number' ? numOutputs : 1}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                min={1}
                                max={20}
                                style={{ margin: '0 16px' }}
                                value={numOutputs}
                                onChange={onNumOutputsChange}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画面描述</label>
                    <TextArea rows={5}></TextArea>
                </Col>
            </Row>
        </div>
    );
};

export default ClickBoard;