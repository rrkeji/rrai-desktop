import React from 'react';
import classnames from 'classnames';
import { PromptsImageGrid } from '@/components/prompts/index';

import styles from './index.less';

export interface PromptsPageProps {

}

export const PromptsPage: React.FC<PromptsPageProps> = ({ }) => {


    return (
        <div className={classnames(styles.container)}>
            <PromptsImageGrid></PromptsImageGrid>
        </div>
    );
};

export default PromptsPage;