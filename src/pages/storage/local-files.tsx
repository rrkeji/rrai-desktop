import React from 'react';
import classnames from 'classnames';

import styles from './local-files.less';

export interface LocalFilesProps {
    className?: string;
}

export const LocalFiles: React.FC<LocalFilesProps> = ({ className }) => {
    
    return (
        <div className={classnames(styles.container, className)}>

        </div>
    );
};

export default LocalFiles;