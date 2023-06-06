import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface TextViewerProps {
    className?: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container)}>
        </div>
    );
};

export default TextViewer;