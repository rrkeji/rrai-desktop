import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, MessageList, ComposerFacade } from '@/components/index';
import { Space, Modal, List, Button, Divider, Avatar } from 'antd';
import { getLocalValue, setLocalValue, logout, clearLocalValue } from '@/utils';
import { UserOutlined, QuestionOutlined, SendOutlined, TeamOutlined } from '@ant-design/icons';

import styles from './index.less';

export const SettingsPage = () => {

  const location = useLocation();

  const params = useParams<string>();

  const [menuFolded, setMenuFolded] = useState<boolean>(false);

  const [addShown, setAddShown] = useState<boolean>(false);

  const [active, setActive] = useState<'time' | 'student'>('time');

  const [version, setVersion] = useState<number>(0);

  const refresh = async (active: 'time' | 'student') => {
  };

  console.log(location);

  useEffect(() => {
    refresh(active).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }, [active, version]);

  return (
    <>
      {
        menuFolded ? ('') : (
          <div className={styles.left}>
            <SideList className={styles.side}>
              <div data-tauri-drag-region className={styles.height24}></div>
              <div className={classnames(styles.side_item)}>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      icon: <UserOutlined />,
                      title: '账号设置',
                      path: '/settings/account'
                    },
                    {
                      icon: <SendOutlined />,
                      title: '意见反馈',
                      path: '/settings/feedback'
                    },
                    {
                      type: 'Divider'
                    },
                    {
                      icon: <TeamOutlined />,
                      title: '关于我们',
                      path: '/settings/about'
                    }
                  ]}
                  renderItem={
                    (item: any, index: number) => {
                      if (item.type === 'Divider') {
                        return (
                          <div className={classnames(styles.list_item, item.path === location.pathname ? styles.active : undefined)}>
                            <Divider key={index} style={{ margin: '16px 0' }}></Divider>
                          </div>
                        );
                      } else {
                        return (
                          <div className={classnames(styles.list_item, item.path === location.pathname ? styles.active : undefined)}>
                            <List.Item
                              actions={[]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar icon={item.icon} />}
                                title={<div className={classnames(styles.title)}>{item.title}</div>}
                                onClick={() => {
                                  history.push(item.path);
                                }}
                              />
                            </List.Item>
                          </div>
                        );
                      }
                    }
                  }
                />
                <Divider style={{ margin: '12px 0' }}></Divider>
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" danger style={{ minWidth: '180px' }} onClick={() => {
                    logout();
                    history.push('/login');
                  }}>退出登录</Button>
                </div>
              </div>
            </SideList>
          </div>
        )
      }
      <div data-tauri-drag-region className={styles.content}>
        <Outlet />
      </div>
    </>
  );
}


export default SettingsPage;