import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './icon-button.less';

export interface IconButtonProps {
    className?: string;
    disabled?: boolean;
    title: string;
    icon: React.ReactNode;
    iconBackgroud?: string;
    onClick?: () => Promise<any>
}

export const IconButton: React.FC<IconButtonProps> = ({ className, title, icon, iconBackgroud, onClick, disabled }) => {
    const [isHover, setIsHover] = useState(false);

    const handleMouseEnter = () => {
        setIsHover(true);
    };

    const handleMouseLeave = () => {
        setIsHover(false);
    };

    return (
        <div className={classnames(styles.container, disabled ? styles.disabled : undefined, className)}
            onClick={!disabled ? onClick : undefined}
            style={{
                backgroundColor: disabled ? '#FFFFFF' : (isHover ? `${iconBackgroud}` : '#FFFFFF'),
                border: disabled ? '1px solid #999999' : (isHover ? `1px solid ${iconBackgroud}` : `1px solid ${iconBackgroud}`)
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className={classnames(styles.icon)}
                style={{
                    color: disabled ? '#999999' : (isHover ? `#FFFFFF` : `${iconBackgroud}`)
                }}>{icon}</div>
            <div className={classnames(styles.title)}
                style={{
                    color: disabled ? '#999999' : (isHover ? `#FFFFFF` : `${iconBackgroud}`)
                }} >{title}</div>
        </div>
    );
};

export default IconButton;