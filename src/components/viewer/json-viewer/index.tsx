import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface JsonViewerProps {
    className?: string;
    content: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ className, content }) => {
    return (
        <div className={classnames(styles.container, className)}>
            {content}
        </div>
    );
};

export default JsonViewer;