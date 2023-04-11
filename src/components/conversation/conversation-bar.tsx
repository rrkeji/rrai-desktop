import React from 'react';
import classnames from 'classnames';
import { EllipsisOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import styles from './conversation-bar.less';

export interface ConversationBarProps {
    className?: string,
    title: string,
    setSettingsShown: () => void,
    menuFolded: boolean,
    setMenuFold: () => void,
}

export const ConversationBar: React.FC<ConversationBarProps> = ({ title, className, setSettingsShown, menuFolded, setMenuFold }) => {

    return (
        <div data-tauri-drag-region className={classnames(styles.container, className)}>
            <div data-tauri-drag-region className={classnames(styles.left)}>
                <div className={classnames(styles.button, styles.left_button)} onClick={setMenuFold}>
                    {menuFolded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
                <div className={classnames(styles.title)}>{title}</div>
            </div>
            <div className={classnames(styles.right)}>
                <div className={classnames(styles.button, styles.right_button)} onClick={setSettingsShown}>
                    <EllipsisOutlined />
                </div>
            </div>
        </div>
    );
};

export default ConversationBar;