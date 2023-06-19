import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Card, Descriptions, Modal, Avatar } from 'antd';
import {
    LightFilter,
    ProForm,
    ModalForm,
    ProFormDateRangePicker,
    ProFormRadio,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
    QueryFilter
} from '@ant-design/pro-components';
import { EditOutlined } from '@ant-design/icons';
import { validateCode, getUserInfor } from '@/services/auth-service';
import { updateDatasetRowById } from '@/tauri/idns/dataset';

import styles from './index.less';

export interface SettingsAccountPageProps {

}
type DataItem = {
    nickname: string;
};

export const SettingsAccountPage: React.FC<SettingsAccountPageProps> = ({ }) => {

    const [userInfor, setUserInfor] = useState<{ rowId: number; nickname: string; avatar: string; vip: number; recharge: number; checkin: string; tags: string; } | null>(null);

    useEffect(() => {
        getUserInfor('').then((userInfor) => {
            console.log(userInfor);
            setUserInfor(userInfor);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    //
    return (
        <div className={classnames(styles.container)}>
            <Card>
                <div className={classnames(styles.avatar)} >
                    <Avatar shape="square" style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size={78}>
                        {userInfor?.nickname}
                    </Avatar>
                    <div className={classnames(styles.names)}>
                        <div>
                            {userInfor?.nickname}
                            <ModalForm<DataItem>
                                trigger={(
                                    <a style={{ padding: '0 10px' }}>
                                        <EditOutlined />
                                    </a>
                                )}
                                onFinish={async (values: any) => {
                                    console.log(values);
                                    if (!values || !values.nickname || values.nickname.length <= 0) {
                                        return;
                                    }
                                    if (userInfor == null) {
                                        return;
                                    }
                                    //获取到添加的内容
                                    //绑定
                                    await updateDatasetRowById(userInfor.rowId, '', JSON.stringify({
                                        "nickname": values.nickname,
                                        "avatar": userInfor.avatar,
                                        "vip": userInfor.vip,
                                        "recharge": userInfor.recharge,
                                        "checkin": userInfor.checkin,
                                    }), userInfor.tags);
                                    //
                                    setUserInfor({
                                        ...userInfor,
                                        "nickname": values.nickname,
                                    });
                                    return true;
                                }}
                            >
                                <ProFormText required colSize={24} name="nickname" label="昵称" />
                            </ModalForm>
                        </div>
                        <div>VIP1</div>
                    </div>
                </div>


            </Card>
        </div>
    );
};

export default SettingsAccountPage;