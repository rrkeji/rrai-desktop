import React from 'react';
import classnames from 'classnames';

import { CommonProperties } from './common';
import { CardSelect } from '@/components/selects';
import styles from './expert-board.less';

export interface ExpertBoardProps {
    className?: string;
    purpose: 'figure' | 'animal' | 'scene';
}

export const ExpertBoard: React.FC<ExpertBoardProps> = ({ }) => {
    return (
        <div className={classnames(styles.container)}>
            敬请期待
        </div>
    );
};

export default ExpertBoard;