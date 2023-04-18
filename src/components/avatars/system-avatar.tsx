import React from 'react';
import classnames from 'classnames';

import { SystemPurposes, SystemPurposeId } from '@/databases/data/purpose';

import LOGO_PNG from '@/assets/logo_256.png';

import styles from './system-avatar.less';

export interface SystemAvatarProps {
    className?: string;
    onClick?: (event: any) => void;
    purposeId: string
}

export const SystemAvatar: React.FC<SystemAvatarProps> = ({ className, purposeId, onClick }) => {
    return (
        <div className={classnames(styles.container, className)} onClick={onClick}>
            <div className={classnames(styles.image)}>{SystemPurposes[purposeId as SystemPurposeId].symbol}</div>
            <div className={classnames(styles.title)}>{SystemPurposes[purposeId as SystemPurposeId].title}</div>
        </div>
    );
};

export default SystemAvatar;