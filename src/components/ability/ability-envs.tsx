import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { autoScan, listAbilityEnvs } from '@/tauri/abilities/abilities';

import styles from './ability-envs.less';

export interface AbilityEnvListProps {
    className?: string;
    itemClassName?: string;
    v?: number;
    itemClick?: (ability: any) => void
}

export const AbilityEnvList: React.FC<AbilityEnvListProps> = ({ className, itemClassName, v, itemClick }) => {

    const [abilities, setAbilities] = useState<Array<any>>([]);

    const refresh = async () => {
        let res = await listAbilityEnvs();

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
                        <div key={index} className={classnames(styles.item, itemClassName, item.is_available === 1 && styles.active)}
                            onClick={() => {
                                itemClick && itemClick(item);
                            }}>
                            <AbilityIcon icon={item.icon}></AbilityIcon>
                            <div className={classnames(styles.title)}>{item.env_name}</div>
                            {
                                item.is_available !== 1 && (
                                    <div className={classnames(styles.mask_bg)}></div>
                                )
                            }
                            <div className={classnames(styles.tag_bg, item.is_available === 1 && styles.active)}></div>
                            <div className={classnames(styles.tag, item.is_available === 1 && styles.active)}>{item.is_available === 1 ? '已激活' : '未激活'}</div>
                        </div>
                    );
                })
            }
        </div>
    );
};


interface AbilityIconProps {
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

export default AbilityEnvList;