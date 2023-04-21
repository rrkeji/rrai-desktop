import React from 'react';
import classnames from 'classnames';

import styles from './side-list-item.less';

export interface SideListItemProps {
    className?: string,
    active?: boolean,
    avatar?: string | React.ReactNode,
    avatarBackground?: string,
    title: string,
    subTitle?: string,
    timestamp?: string,
    rightBar?: React.ReactNode,
    onClick?: (item: any) => void
}

export const SideListItem: React.FC<SideListItemProps> = (props) => {

    const { active, className, avatar, subTitle, title, avatarBackground, timestamp, rightBar } = props;

    return (
        <div className={classnames(styles.container, className, active ? styles.active : undefined)} onClick={() => {
            props.onClick && props.onClick(props);
        }}>
            <div className={classnames(styles.left)}>
                <div className={classnames(styles.avatar)} style={avatarBackground && { backgroundColor: `${avatarBackground}` }}>
                    {avatar}
                </div>
            </div>
            <div className={classnames(styles.center)}>
                <div className={classnames(styles.title)}>
                    {title}
                </div>
                {subTitle && subTitle.length > 0 ? <div className={classnames(styles.sub_title)}>{subTitle ? subTitle : ''}</div> : ' '}
            </div>
            {
                timestamp || rightBar ? (
                    <div className={classnames(styles.right)}>
                        <div className={classnames(styles.time)}>{timestamp}</div>
                        <div className={classnames(styles.right_bar)}>{rightBar}</div>
                    </div>
                ) : ''
            }
        </div>
    );
};

export default SideListItem;