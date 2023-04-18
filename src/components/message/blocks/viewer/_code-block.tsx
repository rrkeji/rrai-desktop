import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { CopyOutlined } from '@ant-design/icons';
import { BlockViewerProps, copyToClipboard, CodeBlockData } from '../types';
import { Box, IconButton, Tooltip } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import styles from './_code-block.less';


export const _CodeBlock: React.FC<BlockViewerProps> = ({ className, data }) => {

    const codeData: CodeBlockData = data as CodeBlockData;

    const handleCopyToClipboard = (e: React.MouseEvent) => {
        e.stopPropagation();
        copyToClipboard(codeData.code);
    };

    return (
        <Box className={classnames(styles.container, className)} component='code' sx={{
            position: 'relative', mx: 0, p: 1.5,
            display: 'block', fontWeight: 500,
            '&:hover > button': { opacity: 1 },
        }}>
            <Tooltip title='Copy Code' variant='solid'>
                <IconButton
                    variant='outlined' color='neutral' onClick={handleCopyToClipboard}
                    sx={{
                        position: 'absolute', top: 0, right: 0, zIndex: 10, p: 0.5,
                        opacity: 0, transition: 'opacity 0.3s',
                    }}>
                    <CopyOutlined />
                </IconButton>
            </Tooltip>
            <Box dangerouslySetInnerHTML={{ __html: codeData.content }} />
        </Box>
    );
};

export default _CodeBlock;