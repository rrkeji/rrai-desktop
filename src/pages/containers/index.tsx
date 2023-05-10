import React, { useState } from 'react';
import classnames from 'classnames';
import { ArrowDownOutlined, FieldTimeOutlined, MoreOutlined, FireOutlined, CheckOutlined, TransactionOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Button, Statistic, Typography } from 'antd';

import { AbilitiesList } from '@/components/ability/index';

import styles from './index.less';
import { autoScan, listAbilities } from '@/tauri/abilities/abilities';

const { Title } = Typography;

export interface ContainersPageProps {

}

export const ContainersPage: React.FC<ContainersPageProps> = ({ }) => {

    const [menuFolded, setMenuFolded] = useState<boolean>(false);

    const [abilitiesVersion, setAbilitiesVersion] = useState<number>(new Date().getTime());

    return (
        <div data-tauri-drag-region className={classnames(styles.container)}>
            <div data-tauri-drag-region className={styles.height24}></div>

            <div className={classnames(styles.top)}>
                <Row gutter={[10, 10]}>
                    <Col span={24}>
                        <Card bordered={false} title="我的能力"
                            extra={
                                <div className={classnames(styles.icons)}>
                                    <FieldTimeOutlined
                                        className={classnames(styles.icon, styles.infor_icon)}
                                        onClick={async () => {
                                            await autoScan();
                                            setAbilitiesVersion(new Date().getTime());
                                        }} />
                                    <MoreOutlined className={classnames(styles.icon, styles.infor_icon)} />
                                </div>
                            }>
                            <AbilitiesList v={abilitiesVersion}></AbilitiesList>
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Card bordered={false} >
                            <Statistic
                                title={
                                    <div className={classnames(styles.statistic_title)}>
                                        <div>正在执行</div>
                                        <InfoCircleOutlined className={styles.infor_icon} />
                                    </div>
                                }
                                value={11}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FireOutlined />}
                                suffix={''}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Card bordered={false}>
                            <Statistic
                                title={
                                    <div className={classnames(styles.statistic_title)}>
                                        <div>已经完成</div>
                                        <InfoCircleOutlined className={styles.infor_icon} />
                                    </div>
                                }
                                value={999}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<CheckOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                        <Card bordered={false}>
                            <Statistic
                                title={
                                    <div className={classnames(styles.statistic_title)}>
                                        <div>盈利</div>
                                        <InfoCircleOutlined className={styles.infor_icon} />
                                    </div>
                                }
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<TransactionOutlined />}
                                suffix=""
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            <div className={classnames(styles.bottom)}>
                <Row gutter={10}>
                    <Col span={12}>
                        <Card bordered={false} className={classnames(styles.local)}
                            title={"周边算力"}
                            extra={<InfoCircleOutlined className={styles.infor_icon} />}
                        >

                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false} className={classnames(styles.local)}
                            title={"全球算力"}
                            extra={<InfoCircleOutlined className={styles.infor_icon} />}
                        >

                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ContainersPage;