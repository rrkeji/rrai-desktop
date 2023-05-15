import React, { useState } from 'react';
import classnames from 'classnames';
import { CardSelect, ImageSelect } from '@/components/selects';

import { CommonProperties } from './common';
import { Row, Col, Input, Select, Slider, InputNumber } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import styles from './freedom-board.less';

export interface FreedomBoardProps {
    className?: string;
    purpose: 'figure' | 'animal' | 'scene';
}

export const FreedomBoard: React.FC<FreedomBoardProps> = ({ }) => {


    const [commonProerties, setCommonProerties] = useState<{
        steps: number;
        batchSize: number;
        ratio: string;
    }>({
        steps: 50,
        batchSize: 2,
        ratio: "1:1",
    });

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

                <CommonProperties commonProerties={commonProerties} onChange={async (val) => {
                    console.log(val);
                    setCommonProerties(val);
                }}></CommonProperties>
            </Row>
        </div>
    );
};

export default FreedomBoard;