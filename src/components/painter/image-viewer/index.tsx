import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface ImagesViewerProps {
    className?: string
}

export const ImagesViewer: React.FC<ImagesViewerProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container, className)}>
            ImagesViewer
        </div>
    );
};

export default ImagesViewer;