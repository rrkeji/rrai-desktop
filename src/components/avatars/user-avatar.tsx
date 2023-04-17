import React from 'react';
import classnames from 'classnames';

import LOGO_PNG from '@/assets/logo_256.png';

import styles from './user-avatar.less';

export interface UserAvatarProps {
    className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container, className)}>
            <img className={classnames(styles.image)} src={LOGO_PNG}></img>
        </div>
    );
};

export default UserAvatar;