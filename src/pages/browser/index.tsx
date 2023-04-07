import React from 'react';
import classnames from 'classnames';
import { Browser } from '@/components/index';
import { history, useParams } from 'umi';

import styles from './index.less';

export interface BrowserPageProps {
}

export const BrowserPage: React.FC<BrowserPageProps> = ({ }) => {

    const { src } = useParams();

    if (!src) {
        return (
            <div className={styles.container}>

            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Browser src={src}></Browser>
        </div>

    );
};

export default BrowserPage;