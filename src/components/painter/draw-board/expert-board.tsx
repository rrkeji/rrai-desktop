import React from 'react';
import classnames from 'classnames';

import { CardSelect } from '@/components/selects';
import styles from './expert-board.less';

export interface ExpertBoardProps {
    className?: string;
}

export const ExpertBoard: React.FC<ExpertBoardProps> = ({ }) => {
    return (
        <div className={classnames(styles.container)}>
            敬请期待
        </div>
    );
};

export default ExpertBoard;