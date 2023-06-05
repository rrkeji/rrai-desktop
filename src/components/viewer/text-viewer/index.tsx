import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface TextViewerProps {
    className?: string;
    text: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({ className, text }) => {
    return (
        <div className={classnames(styles.container)}>
            {text}
        </div>
    );
};

export default TextViewer;