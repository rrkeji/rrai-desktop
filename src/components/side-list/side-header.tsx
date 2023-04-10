import React from 'react';
import classnames from 'classnames';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import { PlusOutlined } from '@ant-design/icons';
import Stack from '@mui/joy/Stack';

import styles from './side-header.less';

export interface SideHeaderProps {
    className?: string
}

export const SideHeader: React.FC<SideHeaderProps> = ({ className }) => {
    return (
        <div data-tauri-drag-region className={classnames(styles.container, className)}>
            <div data-tauri-drag-region className={styles.input}>
                <Input
                    placeholder="搜索"
                    name="keywords"
                    type="text"
                    autoComplete="on"
                    defaultValue=""
                    variant="outlined"
                    sx={{
                        width: '180px',
                        height: '40px'
                    }}
                />
            </div>
            <div data-tauri-drag-region className={styles.button}>
                <IconButton variant="solid">
                    <PlusOutlined />
                </IconButton>
            </div>
        </div>
    );
};

export default SideHeader;