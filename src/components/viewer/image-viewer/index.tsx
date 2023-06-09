import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface ImageViewerProps {
    className?: string;
    url: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ className, url }) => {
    return (
        <div className={classnames(styles.container, className)}>
            <img src={url}></img>
        </div>
    );
};

export default ImageViewer;