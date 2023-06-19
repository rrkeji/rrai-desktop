import React, { useState } from 'react';
import classnames from 'classnames';
import { history, useLocation } from 'umi';
import styles from './index.less';
import { Card, Typography, Input, Space, Button, Modal } from 'antd';
import { validateCode, getUserInfor } from '@/services/auth-service';
import { setLocalValue } from '@/utils';
const { Title, Paragraph } = Typography;

export interface ForbidPageProps {
    className?: string;
}

export const ForbidPage: React.FC<ForbidPageProps> = ({ className }) => {

    const [code, setCode] = useState<string>('');

    const submit = async (code: string) => {
        console.log(code);
        let res = await validateCode(code, '');
        //'invalid' | 'used' | 'valid' | 'error'
        if (res === 'invalid') {
            Modal.error({
                title: '无效的授权码',
                content: '无效的授权码,请重新输入!',
            });
        } else if (res === 'used') {
            Modal.error({
                title: '无效的授权码',
                content: '该授权码已经被使用!',
            });
        } else if (res === 'valid') {
            Modal.success({
                content: '授权成功',
                onOk: () => {
                    history.push('/course');
                }
            });
        } else {
            //error
            Modal.error({
                title: '系统错误',
                content: '系统错误,请刷新重试!',
            });
        }
    };

    return (
        <div className={classnames(styles.container)}>
            <Card title={'没有权限访问'}>
                <div className={classnames(styles.card)}>
                    <Title level={5}>联系管理员:</Title>
                    <Paragraph>
                        电话:<Button type={'link'}>010-62516870</Button>
                    </Paragraph>
                    <Title level={5}>输入授权码:</Title>
                    <Paragraph>
                        授权码为线下获取,可联系管理员.
                        <Space.Compact style={{ width: '80%', margin: '10px 0', }}>
                            <Input value={code} onChange={(event) => {
                                setCode(event.target.value);
                            }} onPressEnter={async (event) => {
                                await submit(code);
                            }} />
                            <Button type="primary" onClick={async () => {
                                await submit(code);
                            }}>提交</Button>
                        </Space.Compact>
                    </Paragraph>
                    <Title level={5}>刷新重试:</Title>
                    <Paragraph>
                        如果已经输入了授权码,可以试着刷新重试.或者关闭重新打开.
                        <Space.Compact style={{ width: '100%', margin: '10px 0', display: 'flex', justifyContent: 'center' }}>
                            <Button type={'dashed'} danger onClick={async () => {
                                //
                                let userInfor = await getUserInfor('');
                                setLocalValue('rrai_nobo_vip', userInfor.vip + '');
                                history.push('/course');
                            }}>刷新重试</Button>
                        </Space.Compact>
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default ForbidPage;