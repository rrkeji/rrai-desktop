import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockViewerProps } from '../types';

import styles from './_text-block.less';


export const _TextBlock: React.FC<BlockViewerProps> = ({ className, avatar, avatarMenu, data, appendMessage }) => {

    return (
        <div className={classnames(styles.container, className)}>
            {data.content}
        </div>
    );
};

export default _TextBlock;