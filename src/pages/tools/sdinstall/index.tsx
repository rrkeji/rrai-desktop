import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Steps } from 'antd';
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
            <Steps
                className={classnames(styles.steps)}
                direction="vertical"
                current={1}
                items={[
                    {
                        title: 'Python3',
                        status: 'finish',
                        icon: <UserOutlined />,
                        description: description
                    },
                    {
                        title: 'Verification',
                        status: 'finish',
                        icon: <SolutionOutlined />,
                        description: ''
                    },
                    {
                        title: 'Pay',
                        status: 'process',
                        icon: <LoadingOutlined />,
                        description: description
                    },
                    {
                        title: 'Done',
                        status: 'wait',
                        icon: <SmileOutlined />,
                        description: ''
                    },
                ]}
            />
        </div>
    );
};

export default SdInstallPage;