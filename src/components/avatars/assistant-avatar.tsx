import React from 'react';
import classnames from 'classnames';

import LOGO_PNG from '@/assets/logo_256.png';
import OPENAI_PNG from '@/assets/svgs/openai.svg';
import { ChatModels, ChatModelId } from '@/databases/data/models';

import styles from './assistant-avatar.less';

export interface AssistantAvatarProps {
    className?: string;
    onClick?: (event: any) => void;
    modelId: string;
}

export const AssistantAvatar: React.FC<AssistantAvatarProps> = ({ className, onClick, modelId }) => {
    return (
        <div className={classnames(styles.container, className)} onClick={onClick}>
            <img className={classnames(styles.image)} src={OPENAI_PNG}></img>
            <div className={classnames(styles.title)}>{ChatModels[modelId as ChatModelId].title}</div>
        </div>
    );
};

export default AssistantAvatar;