import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockViewerProps } from '../types';

import styles from './_code-block.less';


export const _CodeBlock: React.FC<BlockViewerProps> = ({ className, avatar, avatarMenu, data, appendMessage }) => {

    return (
        <div className={classnames(styles.container, className)}>
            <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
        </div>
    );
};

export default _CodeBlock;