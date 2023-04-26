import React, { useState } from 'react';
import classnames from 'classnames';
import { DrawingBoard } from '@/components/painter/index';

import styles from './index.less';

export interface ContainersPageProps {

}

export const ContainersPage: React.FC<ContainersPageProps> = ({ }) => {

    const [menuFolded, setMenuFolded] = useState<boolean>(false);

    return (
        <>
            {
                menuFolded ? ('') : (
                    <div className={styles.left}>
                        <div data-tauri-drag-region className={styles.height24}></div>
                        <DrawingBoard className={styles.side}></DrawingBoard>
                    </div>
                )
            }
        </>
    );
};

export default ContainersPage;