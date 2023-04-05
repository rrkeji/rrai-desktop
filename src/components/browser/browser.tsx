import React from 'react';
import classnames from 'classnames';

import styles from './browser.less';

export interface BrowserProps {
    className?: string
    src: string
}

export const Browser: React.FC<BrowserProps> = ({ className, src }) => {
    return (
        <iframe className={classnames(styles.container, className)} src={src}>
        </iframe>
    );
};

export default Browser;