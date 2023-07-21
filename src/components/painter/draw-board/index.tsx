import React, { useState } from 'react';
import { history, useLocation } from 'umi';
import classnames from 'classnames';
import { Button, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { RunButton } from '@/components/buttons/index';
import { SimpleBoard } from './simple-board';
import { Image2ImageBoard } from './image2image-board';
import { ConversationEntity, MessageEntity } from '@/databases';
import { StableDiffusionText2ImageArgs, StableDiffusionText2ImageArgsDefault, StableDiffusionImage2ImageArgs, StableDiffusionImage2ImageArgsDefault } from '../types';
import { createLocalTask } from '@/services/local-task-service';
import { performTask } from '@/tauri/abilities/index';
import { publishTask } from '@/tauri/idns/index';

import styles from './index.less';

export interface DrawingBoardProps {
    className?: string;
    action: 'IMG2IMG' | 'TXT2IMG' | 'VIDEO2ANIMATION'
    onMessageCreated: (res: { taskResult: { taskType: string, runningTaskId: string }, args: StableDiffusionText2ImageArgs }) => Promise<any>;
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({ className, action, onMessageCreated }) => {

    const [purpose, setPurpose] = useState<'figure' | 'animal' | 'scene'>('figure');

    const [ability, setAbility] = useState<string>('AI_STABLE_DIFFUSION_WEBUI');

    const [loading, setLoading] = useState<boolean>(false);

    const [args, setArgs] = useState<StableDiffusionText2ImageArgs>(StableDiffusionText2ImageArgsDefault);

    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.panel)}>
                {
                    action === 'TXT2IMG' && <SimpleBoard className={classnames(styles.content)} initArgs={StableDiffusionText2ImageArgsDefault} onArgsChange={async (args) => {
                        console.log(args);
                        setArgs(args);
                    }}></SimpleBoard>
                }
                {
                    action === 'IMG2IMG' && <Image2ImageBoard className={classnames(styles.content)} initArgs={StableDiffusionText2ImageArgsDefault} onArgsChange={async (args) => {
                        console.log(args);
                        setArgs(args);
                    }}></Image2ImageBoard>
                }
            </div>
            <div className={classnames(styles.run_button_row)}>
                <Button loading={loading} className={styles.run_button} type={'primary'} onClick={async () => {
                    setLoading(true);
                    let argsObj = JSON.stringify(args);
                    console.log(args);
                    //远程发布
                    //发布到远程, 并获取到任务ID
                    let runningTaskId = await publishTask(ability, "AI_STABLE_DIFFUSION", ability, action, argsObj, "", "", 1000);
                    console.log(runningTaskId);
                    let taskResult = {
                        taskType: 'remote',
                        runningTaskId: runningTaskId,
                    };

                    let res = await createLocalTask("AI_STABLE_DIFFUSION", ability, action, argsObj, taskResult.runningTaskId, '');
                    console.log(res);
                    onMessageCreated({
                        args: args,
                        taskResult: taskResult
                    });

                    setLoading(false);
                }}>开始生成</Button>
            </div>
        </div>
    );
};

export default DrawingBoard;