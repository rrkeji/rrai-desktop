import React, { PropsWithChildren } from 'react';
import classnames from 'classnames';

import styles from './side-list.less';

export type SideListProps = PropsWithChildren<{
    className?: string
}>

export const SideList: React.FC<SideListProps> = ({ className, children }) => {
    return (
        <div className={classnames(styles.container, className)}>
            {children}
        </div>
    );
};

export default SideList;