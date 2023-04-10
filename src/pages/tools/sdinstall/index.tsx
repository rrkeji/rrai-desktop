import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Steps, Button } from 'antd';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { systemProcessExec } from '@/tauri/index';

import styles from './index.less';

export interface SdInstallPageProps {

}

export const SdInstallPage: React.FC<SdInstallPageProps> = ({ }) => {

    useEffect(() => {

        const callFunc = async () => {
            let res = await systemProcessExec("python3 --version");
        };

        callFunc();
    }, []);

    const description = 'This is a description.';

    return (
        <div className={classnames(styles.container)}>
            <div className={classnames(styles.header)}>
                <Button danger type={'primary'}>一键安装</Button>
            </div>
            <div className={classnames(styles.content)}>
                <Steps
                    className={classnames(styles.steps)}
                    current={1}
                    items={[
                        {
                            title: 'Docker',
                            status: 'finish',
                            // icon: <UserOutlined />,
                            description: description
                        },
                        {
                            title: '下载镜像',
                            status: 'finish',
                            // icon: <SolutionOutlined />,
                            description: ''
                        },
                        {
                            title: '启动容器',
                            status: 'process',
                            // icon: <LoadingOutlined />,
                            description: description
                        },
                        {
                            title: '完成',
                            status: 'wait',
                            // icon: <SmileOutlined />,
                            description: ''
                        },
                    ]}
                />
                <div className={classnames(styles.step_content_container)}>
                    <div className={classnames(styles.step_content)}>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SdInstallPage;