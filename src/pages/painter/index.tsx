import React, { useState } from 'react';
import classnames from 'classnames';
import { DrawingBoard, ImagesViewer } from '@/components/painter/index';
import { ContentLoading } from '@/components/loading/index';
import styles from './index.less';

export interface PainterPageProps {

}

export const PainterPage: React.FC<PainterPageProps> = ({ }) => {

    const [menuFolded, setMenuFolded] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
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
            {
                loading ? (
                    <ContentLoading className={styles.conversation}  ></ContentLoading>
                ) : (
                    <ImagesViewer className={styles.conversation}></ImagesViewer>
                )
            }

        </>
    );
};

export default PainterPage;