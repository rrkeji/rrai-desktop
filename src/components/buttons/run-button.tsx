import React, { useState } from 'react';
import classnames from 'classnames';
import type { RadioChangeEvent } from 'antd';
import { Radio, Button } from 'antd';
import { performTask } from '@/tauri/abilities/index';

import styles from './run-button.less';

export interface RunButtonProps {
    className?: string;
    ability: string;
    args: string;
    onTaskPublished: (result: {
        taskType: 'local' | 'remote',
        runningTaskId: string,
    }) => Promise<void>
}

export const RunButton: React.FC<RunButtonProps> = ({ className, ability, args, onTaskPublished }) => {

    const [value, setValue] = useState(1);

    const [loading, setLoading] = useState<boolean>(false);

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.env_container)}>
                <Radio.Group onChange={onChange} value={value}>
                    <Radio value={1}>本机运行</Radio>
                    <Radio value={2}>委派任务</Radio>
                </Radio.Group>
            </div>

            <div className={classnames(styles.button_container)}>
                <Button loading={loading} className={styles.button} type={'primary'} onClick={async () => {
                    setLoading(true);
                    //发布或者执行任务，获取到任务ID
                    let runningTaskId = await performTask(ability, args);
                    console.log(runningTaskId);
                    await onTaskPublished({
                        taskType: 'local',
                        runningTaskId: runningTaskId,
                    });
                    setLoading(false);
                }}>运行任务</Button>
            </div>

        </div>
    );
};

export default RunButton;