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


    const guideMarkdown = () => {
        let guide = ability.install_guide;
        //TODO stable diffusion的先在前端写
        if (ability.ability === 'StableDiffusion') {
            guide = " > - 依赖Python的环境\n > - 安装依赖的库\n > - 下载模型文件\n > - 在下面输入模型的路径 ";
        }
        return guide;
    };



    return (
        <div className={classnames(styles.container, className)}>
            <Divider />
            <Row>
                <Col span={24} className={classnames(styles.buttons)} >
                    <Button disabled={ability.is_available === 1 && false} type="primary" danger
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideMarkdown()}</ReactMarkdown>
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