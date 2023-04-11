import { useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader } from '@/components/index';
import { ConversationBar } from '@/components/conversation/index';
import { Drawer } from 'antd';
import { getConversationsByType } from '@/services/conversation-service';

import { getLocalValue } from '@/utils';

import styles from './index.less';

export const ConversationPage = () => {

  const location = useLocation();

  // {conversationType,conversationId}
  const params = useParams<string>();

  const [active, setActive] = useState<string | null>(getLocalValue('rrai_active_menu'));

  const [items, setItems] = useState<Array<any>>([]);

  const [menuFolded, setMenuFolded] = useState<boolean>(false);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [conversationTitle, setConversationTitle] = useState<string | null>(null);

  useEffect(() => {
    const call = async () => {
      console.log(params.conversationType);
      if (params.conversationType && params.conversationType != active) {
        //根据会话类型获取所有的会话
        let response: any = await getConversationsByType(params.conversationType);
        console.log(response);

        if (response && response.data) {
          setItems(response.data);
        } else {
          setItems([]);
        }
        setActive(params.conversationType);
      } else {
        setActive(null);
      }
    };

    call();
  }, [params.conversationType, active]);

  //
  useEffect(() => {
    if (params.conversationId) {
      setConversationId(params.conversationId);
    } else {
      setConversationId(null);
    }
  }, [params.conversationId]);

  return (
    <>
      {
        menuFolded ? ('') : (
          <SideList className={styles.side}>
            <div data-tauri-drag-region className={styles.height24}></div>
            <SideHeader activeModule={active} className={styles.side_header}></SideHeader>
            {
              items && items.map((item: any, index: number) => {
                return (
                  <SideListItem
                    key={index}
                    className={classnames(styles.side_item)}
                    active={item.id === conversationId}
                    title={item.title}
                    avatar={<div className={classnames(styles.side_item_avatar, "iconfont icon-a-205shezhi")}></div>}
                    avatarBackground={'#0493F5'}
                    onClick={() => {
                      setConversationId(item.id);
                      setConversationTitle(item.title);
                      // history.replace(`/conversation/${active}/${item.id}`);
                      // history.push(`/conversation/${active}/${item.id}`);
                    }}
                  ></SideListItem>
                );
              })
            }
          </SideList>
        )
      }
      <div className={styles.conversation}>
        <ConversationBar
          title={conversationTitle == null ? '' : conversationTitle} className={styles.bar}
          setSettingsShown={() => {
            setDrawerOpen(!drawerOpen);
          }} menuFolded={menuFolded} setMenuFold={() => {
            setMenuFolded(!menuFolded);
          }}></ConversationBar>



        <div className={styles.content}>
          <div >

          </div>
          <Drawer
            width={310}
            placement={"right"}
            closable={false}
            onClose={() => {
              setDrawerOpen(false);
            }}
            open={drawerOpen}
            maskStyle={{
              opacity: 0
            }}
            getContainer={false}
          >
          </Drawer>
        </div>
      </div>
    </>
  );
}


export default ConversationPage;