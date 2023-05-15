import React from 'react';
import classnames from 'classnames';
import { Row, Col, Typography, Input, Select } from 'antd';
import { CardSelect } from '@/components/selects/index';

import styles from './add-painter-conversation.less';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export type PainterConversationArgs = {
    painterType: 'text2image' | 'image2image',
    baseModel: 'sd1.4' | 'sd1.5',
    purposeId: string,
}

export const getPainterDefaultArgs = (): PainterConversationArgs => {
    return {
        painterType: 'text2image',
        baseModel: 'sd1.4',
        purposeId: 'figure'
    };
};

export interface AddPainterConversationProps {
    name: string;
    onNameChange: (value: string) => void;
    args: PainterConversationArgs;
    onArgsChange: (args: PainterConversationArgs) => void
}

export const AddPainterConversation: React.FC<AddPainterConversationProps> = ({ name, args, onArgsChange, onNameChange }) => {

    const handleEditTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onNameChange(e.target.value);
    }

    return (
        <Row className={classnames(styles.container)}>
            <Col span={24}>
                <label className={classnames(styles.label)}>会话名称：</label>
            </Col>
            <Col span={24}>
                <TextArea rows={2} value={name} onChange={handleEditTextChanged}></TextArea>
            </Col>
            <Col span={24}>
                <label className={classnames(styles.label)}>绘画类型：</label>
            </Col>
            <Col span={24}>
                <Select
                    value={args.painterType}
                    className={classnames(styles.input)}
                    onChange={(val) => {
                        onArgsChange({ ...args, painterType: val });
                    }}>
                    <Option value={'text2image'}>文生图</Option>
                    <Option value={'image2image'}>图生图</Option>
                </Select>
            </Col>
            <Col span={24}>
                <label className={classnames(styles.label)}>基础模型：</label>
            </Col>
            <Col span={24}>
                <Select
                    value={args.baseModel}
                    className={classnames(styles.input)}
                    onChange={(val) => {
                        onArgsChange({ ...args, baseModel: val });
                    }}>
                    <Option value={'sd1.4'}>Stable Difussion 1.4</Option>
                    <Option value={'sd1.5'}>Stable Difussion 1.5</Option>
                </Select>
            </Col>
            <Col span={24}>
                <label className={classnames(styles.label)}>目标：</label>
            </Col>
            <Col span={24}>
                <CardSelect
                    value={args.purposeId}
                    items={[
                        {
                            icon: (<div>👩‍💻</div>),
                            value: 'figure',
                            title: '人物'
                        },
                        {
                            icon: (<div>👩‍💻</div>),
                            value: 'animal',
                            title: '动物'
                        },
                        {
                            icon: (<div>👩‍💻</div>),
                            value: 'scene',
                            title: '场景'
                        }
                    ]}
                    onValueChange={(val) => {
                        onArgsChange({ ...args, purposeId: val });
                    }}
                ></CardSelect>
            </Col>
        </Row >
    );
};

export default AddPainterConversation;