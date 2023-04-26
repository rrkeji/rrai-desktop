import React from 'react';
import classnames from 'classnames';

import styles from './index.less';

export interface DrawingBoardProps {
    className?: string;
}

export const DrawingBoard: React.FC<DrawingBoardProps> = ({ className }) => {
    return (
        <div className={classnames(styles.container, className)}>
            DrawingBoard
        </div>
    );
};

export default DrawingBoard;