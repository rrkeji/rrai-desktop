import React, { useState } from 'react';
import classnames from 'classnames';
import { AbilitySettings } from './ability-settings';
import { Card, Button, Col, Row, Typography, Divider } from 'antd';
import { abilityScan } from '@/tauri/abilities/index';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ability-active.less';

const { Title, Paragraph, Text } = Typography;

export interface AbilityActiveProps {
    className?: string;
    ability: any;
}

export const AbilityActive: React.FC<AbilityActiveProps> = ({ className, ability }) => {

    const [ellipsis, setEllipsis] = useState(false);

    return (
        <div className={classnames(styles.container, className)}>
            <Divider />
            <Row>
                <Col span={24} className={classnames(styles.buttons)} >
                    <Button disabled={ability.is_available === 1} type="primary" danger
                        onClick={async () => {
                            //激活
                            let res = await abilityScan(ability.ability);
                        }}>激活</Button>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Title level={5}>能力激活说明</Title>
                    <Paragraph ellipsis={ellipsis}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            ```typescript
                            import 
                            ```
                        </ReactMarkdown>
                    </Paragraph>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Title level={5}>能力配置</Title>
                    <AbilitySettings ability={ability}></AbilitySettings>
                </Col>
            </Row>

        </div>
    );
};

export default AbilityActive;