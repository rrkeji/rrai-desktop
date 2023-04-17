import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockViewerProps } from '../types';

import styles from './_markdown-block.less';


export const _TextBlock: React.FC<BlockViewerProps> = ({ className, avatar, avatarMenu, message, appendMessage }) => {

    return (
        <div className={classnames(styles.container, className)}>
            {message.text}
        </div>
    );
};

export default _TextBlock;