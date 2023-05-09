import React, { useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';

import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import styles from './freedom-board.less';

export interface FreedomBoardProps {
    className?: string;
}

export const FreedomBoard: React.FC<FreedomBoardProps> = ({ }) => {


    const [numOutputs, setNumOutputs] = useState<number>(1);

    const onNumOutputsChange = (newValue: number | null) => {
        if (newValue != null)
            setNumOutputs(newValue);
    };

    return (
        <div className={classnames(styles.container)}>
            <Row>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>正向描述</label>
                    <TextArea rows={10}></TextArea>
                </Col>
                <Col span={24} className={classnames(styles.item)}>
                    <label className={classnames(styles.label)}>反向描述</label>
                    <TextArea rows={5}></TextArea>
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

export default FreedomBoard;