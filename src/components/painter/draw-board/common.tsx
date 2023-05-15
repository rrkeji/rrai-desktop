import React, { useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';

import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import styles from './common.less';

export interface CommonPropertiesProps {
    className?: string;
    commonProerties: {
        steps: number;
        batchSize: number;
        ratio: string;
    };
    onChange: (val: {
        steps: number;
        batchSize: number;
        ratio: string;
    }) => Promise<void>
}


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

export const CommonProperties: React.FC<CommonPropertiesProps> = ({ className, commonProerties, onChange }) => {

    return (
        <Row className={classnames(styles.container, className)}>
            <Col span={24} className={classnames(styles.item)}>
                <label className={classnames(styles.label)}>生成步数</label>
                <Row>
                    <Col span={18}>
                        <Slider
                            style={{ width: '90%' }}
                            min={1}
                            max={20}
                            onChange={async (newValue: number | null) => {
                                if (newValue != null) {
                                    await onChange({ ...commonProerties, steps: newValue });
                                }
                            }}
                            value={typeof commonProerties.steps === 'number' ? commonProerties.steps : 1}
                        />
                    </Col>
                    <Col span={6}>
                        <InputNumber
                            min={1}
                            max={20}
                            style={{ width: '100%' }}
                            value={commonProerties.steps}
                            onChange={async (newValue: number | null) => {
                                if (newValue != null) {
                                    await onChange({ ...commonProerties, steps: newValue });
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
                <Select value={commonProerties.ratio} onChange={async (value) => {
                    await onChange({ ...commonProerties, ratio: value });
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
                            max={20}
                            onChange={async (newValue: number | null) => {
                                if (newValue != null) {
                                    await onChange({ ...commonProerties, batchSize: newValue });
                                }
                            }}
                            value={typeof commonProerties.batchSize === 'number' ? commonProerties.batchSize : 1}
                        />
                    </Col>
                    <Col span={6}>
                        <InputNumber
                            min={1}
                            max={20}
                            style={{ width: '100%' }}
                            value={commonProerties.batchSize}
                            onChange={async (newValue: number | null) => {
                                if (newValue != null) {
                                    await onChange({ ...commonProerties, batchSize: newValue });
                                }
                            }}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default CommonProperties;