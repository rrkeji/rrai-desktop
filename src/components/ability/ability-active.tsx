import React, { useState } from 'react';
import classnames from 'classnames';
import { AbilitySettings } from './ability-settings';
import { Card, Col, Row, Typography, Divider } from 'antd';

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
                <Col span={24}>
                    <Title level={5}>能力激活说明</Title>
                    <Paragraph ellipsis={ellipsis}>
                        暂时可以使用互联网进行搜索，或者询问AI
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