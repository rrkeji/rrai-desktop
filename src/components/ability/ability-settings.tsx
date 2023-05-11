import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Button, Col, Input, Row, Space } from 'antd';
import { JsonSchemaForm } from '@/components/schema/index';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import { BetaSchemaForm } from '@ant-design/pro-components';
import { schemaByModel } from '@/tauri/idns/index';

import styles from './ability-settings.less';

const { TextArea } = Input;

export interface AbilitySettingsProps {
    className?: string;
    ability: any;
}

export const AbilitySettings: React.FC<AbilitySettingsProps> = ({ className, ability }) => {

    const [columns, setColumns] = useState<ProFormColumnsType<any>[]>([]);

    //获取schema
    useEffect(() => {
        console.log('settings_schema', ability.settings_schema);
        if (!ability.settings_schema || ability.settings_schema == '') {
            return;
        }
        //通过模型id获取到json schema
        const call = async () => {
            let res = await schemaByModel(ability.settings_schema, 0);
            console.log(res);
            if (res && res.properties) {
                let cols: ProFormColumnsType<any>[] = [];

                for (let key in res.properties) {
                    let item = res.properties[key];

                    cols.push({
                        title: item.description,
                        key: key,
                        dataIndex: key,
                        valueType: item.type,
                    });
                }

                setColumns(cols);
            }
        };
        call();
    }, [ability.settings_schema]);

    return (
        <div className={classnames(styles.container, className)}>
            <BetaSchemaForm<any>
                shouldUpdate={false}
                layoutType="Form"
                onFinish={async (values) => {
                    console.log(values);
                    //保存设置
                }}
                columns={columns}
            />
        </div>
    );
};

export default AbilitySettings;