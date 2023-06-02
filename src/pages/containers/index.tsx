import React, { useState } from 'react';
import classnames from 'classnames';
import { Button, Divider, Empty, RadioChangeEvent, Radio, Card, Col, Row, Modal, Statistic, Typography } from 'antd';
import { LocalContainersPage } from './local-container';
import { P2PContainersPage } from './p2p-container';

import styles from './index.less';

const { Title } = Typography;

export interface ContainersPageProps {

}

export const ContainersPage: React.FC<ContainersPageProps> = ({ }) => {

    const [active, setActive] = useState<'local' | 'p2p'>('local');

    return (
        <div className={classnames(styles.container)}>
            <div data-tauri-drag-region className={classnames(styles.header)}>
                <div data-tauri-drag-region className={classnames(styles.left)}>

                </div>
                <div data-tauri-drag-region className={classnames(styles.center)}>
                    <Radio.Group
                        options={[
                            { label: '我的算力', value: 'local' },
                            { label: '周边算力', value: 'p2p' },
                        ]}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            setActive(value);
                        }}
                        value={active}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div data-tauri-drag-region className={classnames(styles.right)}>
                </div>
            </div>
            <div className={classnames(styles.content)}>
                {
                    active === 'local' && <LocalContainersPage></LocalContainersPage>
                }
                {
                    active === 'p2p' && <P2PContainersPage></P2PContainersPage>
                }
            </div>
        </div>
    );
};

export default ContainersPage;