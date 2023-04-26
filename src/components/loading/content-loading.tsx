import React from 'react';
import classnames from 'classnames';

import styles from './content-loading.less';

export interface ContentLoadingProps {
    className?: string;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container, className)}>

        </div>
    );
};

export default ContentLoading;