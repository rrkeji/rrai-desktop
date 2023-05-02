import React from 'react';
import classnames from 'classnames';
import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { RunButton } from '@/components/buttons/index';
import { ClickBoard } from './click-board';
import { ExpertBoard } from './expert-board';
import { SimpleBoard } from './simple-board';
import { FreedomBoard } from './freedom-board';

import styles from './index.less';

export interface DrawingBoardProps {
    className?: string;
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({ className }) => {

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `一句话`,
            children: (
                <SimpleBoard className={classnames(styles.content)}></SimpleBoard>
            ),
        },
        {
            key: '2',
            label: `点选`,
            children: (
                <ClickBoard className={classnames(styles.content)}></ClickBoard>
            ),
        },
        {
            key: '3',
            label: `专业`,
            children: (
                <ExpertBoard className={classnames(styles.content)}></ExpertBoard>
            ),
        },
        {
            key: '4',
            label: `自由`,
            children: (
                <FreedomBoard className={classnames(styles.content)}></FreedomBoard>
            ),
        },
    ];

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.example)}>
                <Button type={'link'}>查看示例</Button>
            </div>
            <Tabs
                centered
                className={classnames(styles.panel)}
                defaultActiveKey="1"
                items={items}
                onChange={onChange} />
            <RunButton className={classnames(styles.run_button)}></RunButton>
        </div>
    );
};

export default DrawingBoard;