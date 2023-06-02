import React, { useState } from 'react';
import classnames from 'classnames';
import { ArrowDownOutlined, FieldTimeOutlined, MoreOutlined, FireOutlined, CheckOutlined, TransactionOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Row, Modal, Statistic, Typography } from 'antd';

import { AbilitiesList, AbilityActive } from '@/components/ability/index';

import styles from './p2p-container.less';
import { autoScan, listAbilities } from '@/tauri/abilities/abilities';

const { Title } = Typography;

export interface ContainersPageProps {

}

export const P2PContainersPage: React.FC<ContainersPageProps> = ({ }) => {

    const [menuFolded, setMenuFolded] = useState<boolean>(false);

    const [abilitiesVersion, setAbilitiesVersion] = useState<number>(new Date().getTime());

    const [isAbilityModalOpen, setIsAbilityModalOpen] = useState(false);

    const [currentAbility, setCurrentAbility] = useState<any | null>(null);

    return (
        <>
            <div data-tauri-drag-region className={classnames(styles.container)}>
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

            <Modal
                title={currentAbility && currentAbility.ability}
                open={isAbilityModalOpen}
                centered={true}
                onCancel={() => {
                    setIsAbilityModalOpen(false);
                    setAbilitiesVersion(new Date().getTime());
                }}
                width={1000}
                footer={null}
            >
                <AbilityActive ability={currentAbility}></AbilityActive>
            </Modal>
        </>
    );
};

export default P2PContainersPage;