import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockViewerProps } from '../types';
import { Typography } from '@mui/joy';


import styles from './_text-block.less';


export const _TextBlock: React.FC<BlockViewerProps> = ({ className, data, sx }) => {

    return (
        <Typography className={classnames(styles.container, className)} component='span' sx={{ ...(sx || {}), mx: 1.5, overflowWrap: 'anywhere' }}>
            {data.content}
        </Typography>
    );
};

export default _TextBlock;