import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { autoScan, listAbilities } from '@/tauri/abilities/abilities';

import styles from './abilities.less';

export interface AbilitiesListProps {
    className?: string;
    itemClassName?: string;
    v?: number;
}

export const AbilitiesList: React.FC<AbilitiesListProps> = ({ className, itemClassName, v }) => {

    const [abilities, setAbilities] = useState<Array<any>>([]);

    const refresh = async () => {
        let res = await listAbilities();

        setAbilities(res);
    };

    useEffect(() => {
        refresh();
    }, [v]);

    return (
        <div className={classnames(styles.container, className)}>
            {
                abilities && abilities.map((item, index) => {
                    return (
                        <div key={index} className={classnames(styles.item, itemClassName, item.is_available === 1 && styles.active)}>
                            <AbilityIcon icon={item.icon}></AbilityIcon>
                            <div className={classnames(styles.title)}>{item.ability}</div>
                        </div>
                    );
                })
            }
        </div>
    );
};


export interface AbilityIconProps {
    className?: string;
    icon: string;
}

const AbilityIcon: React.FC<AbilityIconProps> = ({ className, icon }) => {

    if (icon.indexOf('http') === 0) {
        return (
            <div className={classnames(styles.icon, className)}>
                <img src={icon}></img>
            </div>
        );
    }
    return (
        <></>
    );
}

export default AbilitiesList;