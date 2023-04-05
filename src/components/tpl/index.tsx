import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface TplProps {

}

export const TPL: React.FC<TplProps> = ({ }) => {
    return (
        <div className={classnames(styles.container)}>

        </div>
    );
};

export default TPL;