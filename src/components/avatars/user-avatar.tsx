import React from 'react';
import classnames from 'classnames';

import LOGO_PNG from '@/assets/logo_256.png';

import styles from './user-avatar.less';

export interface UserAvatarProps {
    className?: string;
    onClick?: (event: any) => void
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ className, onClick }) => {
    return (
        <div className={classnames(styles.container, className)} onClick={onClick}>
            <img className={classnames(styles.image)} src={LOGO_PNG}></img>
        </div>
    );
};

export default UserAvatar;