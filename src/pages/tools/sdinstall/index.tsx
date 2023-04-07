import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface SdInstallPageProps {

}

export const SdInstallPage: React.FC<SdInstallPageProps> = ({ }) => {
    return (
        <div className={classnames(styles.container)}>
            SdInstallPageProps
        </div>
    );
};

export default SdInstallPage;