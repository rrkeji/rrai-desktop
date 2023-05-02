import React, { useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';

import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import styles from './simple-board.less';

export interface SimpleBoardProps {
    className?: string;
}

export const SimpleBoard: React.FC<SimpleBoardProps> = ({ }) => {


    const [numOutputs, setNumOutputs] = useState<number>(1);

    const onNumOutputsChange = (newValue: number | null) => {
        if (newValue != null)
            setNumOutputs(newValue);
    };

    return (
        <div className={classnames(styles.container)}>
            <Row>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>画面描述</label>
                    <TextArea rows={5}></TextArea>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>风格</label>
                    <ImageSelect
                        value={'figure'}
                        items={[
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '漫画'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '现实照片'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '赛博朋克'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '蒸汽朋克'
                            },
                        ]}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>镜头</label>
                    <ImageSelect
                        value={'figure'}
                        items={[
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '微距'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '特写'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'figure',
                                title: '头像'
                            },
                            {
                                icon: (<div>👩‍💻</div>),
                                value: 'animal ',
                                title: '半身照'
                            },
                        ]}
                        onValueChange={(val) => {
                        }}
                    ></ImageSelect>
                </Col>
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
            </Row>
        </div>
    );
};

export default SimpleBoard;