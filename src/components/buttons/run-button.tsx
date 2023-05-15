import React, { useState } from 'react';
import classnames from 'classnames';
import type { RadioChangeEvent } from 'antd';
import { Radio, Button } from 'antd';
import styles from './run-button.less';

export interface RunButtonProps {
    className?: string;
    ability: string;
    args: any;
}

export const RunButton: React.FC<RunButtonProps> = ({ className, ability, args }) => {

    const [value, setValue] = useState(1);

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
                <Button className={styles.button} type={'primary'} >运行任务</Button>
            </div>

        </div>
    );
};

export default RunButton;