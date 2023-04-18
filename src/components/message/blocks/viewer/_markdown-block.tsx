import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockViewerProps } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Typography } from '@mui/joy';

import styles from './_markdown-block.less';


export const _MarkdownBlock: React.FC<BlockViewerProps> = ({ className, data, sx }) => {

    return (
        <Typography className={classnames(styles.container, className)} component='span' sx={{
            ...(sx || {}), mx: 1.5,
            '& p': { // Add this style override
                marginBlockStart: 0,
                marginBlockEnd: 0,
                maxWidth: '90%',
            },
            '& table': { // Add this style override
                minWidth: '200%',
                overflowX: 'auto',
                display: 'block',
            },
        }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
        </Typography>
    );
};

export default _MarkdownBlock;