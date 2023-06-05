import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface ImageViewerProps {
    className?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container)}>

        </div>
    );
};

export default ImageViewer;