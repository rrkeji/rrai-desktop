import React from 'react';
import classnames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import styles from './side-header.less';

const { Search } = Input;

export interface SideHeaderProps {
    className?: string,
    activeModule: string | null
}

export const SideHeader: React.FC<SideHeaderProps> = ({ className }) => {



    return (
        <div data-tauri-drag-region className={classnames(styles.container, className)}>
            <div data-tauri-drag-region className={styles.input}>
                <Search placeholder="搜索" onSearch={(value: string) => {
                    console.log(value);
                }} />
            </div>
            <div data-tauri-drag-region className={styles.button}>
                <PlusOutlined />
            </div>
        </div>
    );
};

export default SideHeader;