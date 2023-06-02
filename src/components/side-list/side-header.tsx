import React, { useState } from 'react';
import classnames from 'classnames';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import styles from './side-header.less';

const { Search } = Input;

export interface SideHeaderProps {
    className?: string;
    activeModule: string;
    onAddConversation?: (conversationType: string) => Promise<any>;
    onSearch: (keywords: string) => Promise<any>;
}

export const SideHeader: React.FC<SideHeaderProps> = ({ className, activeModule, onAddConversation, onSearch }) => {

    const [keywords, setKeywords] = useState<string>('');

    return (
        <div data-tauri-drag-region className={classnames(styles.container, className)}>
            <div data-tauri-drag-region className={styles.input}>
                <Search
                    placeholder="搜索"
                    onSearch={async (value: string) => {
                        await onSearch(value);
                    }}
                    value={keywords}
                    allowClear={true}
                    onChange={(event) => {
                        setKeywords(event.target.value);
                    }} onPressEnter={async (event) => {
                        await onSearch(keywords);
                    }}
                />
            </div>
            {
                onAddConversation ? (<div data-tauri-drag-region className={styles.button} onClick={async () => {
                    await onAddConversation(activeModule);
                }}>
                    <PlusOutlined />
                </div>) : ('')
            }
        </div>
    );
};

export default SideHeader;