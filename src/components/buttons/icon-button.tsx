import React from 'react';
import classnames from 'classnames';

import styles from './icon-button.less';

export interface IconButtonProps {
    className?: string;
    title: string;
    titleColor?: string;
    icon: React.ReactNode;
    iconBackgroud?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ className, title, titleColor, icon, iconBackgroud }) => {
    return (
        <div className={classnames(styles.container, className)}>
            <div className={classnames(styles.icon)} style={{
                backgroundColor: `${iconBackgroud}`
            }}>{icon}</div>
            <div className={classnames(styles.title)} style={{
                color: `${titleColor}`
            }}>{title}</div>
        </div>
    );
};

export default IconButton;