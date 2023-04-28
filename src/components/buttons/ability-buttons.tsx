import React from 'react';
import classnames from 'classnames';
import { InsuranceOutlined } from '@ant-design/icons';

import styles from './ability-buttons.less';

export interface AbilityButtonsProps {
    className?: string;
    itemClassName?: string;
}

const items = [
    {
        icon: <InsuranceOutlined />,
        title: 'SD1.5',
        active: true,
    }, {
        icon: <InsuranceOutlined />,
        title: 'SD1.5',
        active: false,
    }
];

export const AbilityButtons: React.FC<AbilityButtonsProps> = ({ className, itemClassName }) => {

    return (
        <div className={classnames(styles.container, className)}>
            {
                items && items.map((item, index) => {
                    return (
                        <div key={index} className={classnames(styles.item, itemClassName, item.active && styles.active)}>
                            <div className={classnames(styles.icon)}>{item.icon}</div>
                            <div className={classnames(styles.title)}>{item.title}</div>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default AbilityButtons;