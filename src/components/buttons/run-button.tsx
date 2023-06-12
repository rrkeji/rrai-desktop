import React, { useState } from 'react';
import classnames from 'classnames';
import type { RadioChangeEvent } from 'antd';
import { Radio, Button } from 'antd';
import { performTask } from '@/tauri/abilities/index';
import { publishTask } from '@/tauri/idns/index';

import styles from './run-button.less';

export interface RunButtonProps {
    className?: string;
    taskType: string;
    ability: string;
    args: string;
    onTaskPublished: (result: {
        taskType: 'local' | 'remote',
        runningTaskId: string,
    }) => Promise<void>
}

export const RunButton: React.FC<RunButtonProps> = ({ className, taskType, ability, args, onTaskPublished }) => {

    const [value, setValue] = useState(1);

    const [loading, setLoading] = useState<boolean>(false);

    const [options, setOptions] = useState<any>({});

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.env_container)}>
                <div className={classnames(styles.options)}>
                    {
                        value === 2 && <OptonsForm options={options} onOptionsChange={async (options) => {
                            setOptions(options);
                        }}></OptonsForm>
                    }
                </div>
                <div className={classnames(styles.mode)}>
                    <Radio.Group onChange={onChange} value={value}>
                        <Radio value={1}>本机运行</Radio>
                        <Radio value={2}>委派任务</Radio>
                    </Radio.Group>
                </div>
            </div>

            <div className={classnames(styles.button_container)}>
                <Button loading={loading} className={styles.button} type={'primary'} onClick={async () => {
                    setLoading(true);

                    if (value === 1) {
                        //本地发布
                        //发布或者执行任务，获取到任务ID
                        let runningTaskId = await performTask(ability, args);
                        console.log(runningTaskId);
                        await onTaskPublished({
                            taskType: 'local',
                            runningTaskId: runningTaskId,
                        });
                    } else if (value === 2) {
                        //远程发布
                        //发布到远程, 并获取到任务ID
                        let runningTaskId = await publishTask(ability, "AI_STABLE_DIFFUSION", ability, args, "", "", 1000);
                        console.log(runningTaskId);
                        await onTaskPublished({
                            taskType: 'remote',
                            runningTaskId: runningTaskId,
                        });
                    }

                    setLoading(false);
                }}>运行任务</Button>
            </div>

        </div>
    );
};

export interface OptonsFormProps {
    className?: string;
    options: any;
    onOptionsChange: (options: any) => Promise<void>;
}

const OptonsForm: React.FC<OptonsFormProps> = ({ className }) => {

    return (
        <div>
            <label>油费:</label>
        </div>
    );
}

export default RunButton;