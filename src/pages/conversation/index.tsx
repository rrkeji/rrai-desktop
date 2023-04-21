import { useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader, MessageList, ComposerFacade } from '@/components/index';
import { ConversationBar, AddConversation, ConversationViewer, EmptyConversation } from '@/components/conversation/index';
import { Drawer, Modal } from 'antd';
import { getConversationsByType, createConversation } from '@/services/conversation-service';
import { createChatMessage } from '@/services/message-service';

import { getLocalValue, setLocalValue } from '@/utils';

import styles from './index.less';

export const ConversationPage = () => {

  const location = useLocation();

  const params = useParams<string>();

  const conversationType = params.conversationType;

  const [items, setItems] = useState<Array<any>>([]);

  const [menuFolded, setMenuFolded] = useState<boolean>(false);

  const [addShown, setAddShown] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  if (!conversationType) {
    return <>conversationType为空!</>
  }

  const refresh = async (conversationType: string, reset: boolean) => {
    //根据会话类型获取所有的会话
    let response: any = await getConversationsByType(conversationType);
    console.log(response);

    if (response && response.data && response.data.length > 0) {
      //所有的会话
      let conversationId = getLocalValue(`${conversationType}_conversationId`);
      if (!reset && conversationId) {
        setConversationId(conversationId);
      } else {
        setLocalValue(`${conversationType}_conversationId`, response.data[0].uid);
        setConversationId(response.data[0].uid);
      }
      setItems(response.data);
    } else {
      setItems([]);
      setConversationId(null);
    }
  };

  useEffect(() => {
    const call = async () => {
      refresh(conversationType, false);
    };
    call();
  }, [conversationType]);

  //
  useEffect(() => {
    if (params.conversationId) {
      setLocalValue(`${conversationType}_conversationId`, params.conversationId);
      setConversationId(params.conversationId);
    } else {
      setConversationId(null);
    }
  }, [params.conversationId]);

  console.log(conversationType, params.conversationType);

  return (
    <>
      {
        menuFolded ? ('') : (
          <div className={styles.left}>
            <div data-tauri-drag-region className={styles.height24}></div>
            <SideHeader activeModule={conversationType!} className={styles.side_header} onAddConversation={async (conversationType) => {
              //弹出对话框
              setAddShown(true);
            }}></SideHeader>
            <SideList className={styles.side}>
              {
                items && items.map((item: any, index: number) => {
                  return (
                    <SideListItem
                      key={index}
                      className={classnames(styles.side_item)}
                      active={item.uid === conversationId}
                      title={item.name}
                      avatar={<ConversationIcon conversationType={conversationType} item={item} className={classnames(styles.side_item_avatar)}></ConversationIcon>}
                      avatarBackground={conversationType == 'chat' ? '#dedede' : '#0493F5'}
                      timestamp={item.created.split(' ')[0]}
                      rightBar={
                        <div>{item.args['model']}</div>
                      }
                      onClick={() => {
                        setLocalValue(`${conversationType}_conversationId`, item.uid);
                        setConversationId(item.uid);
                      }}
                    ></SideListItem>
                  );
                })
              }
            </SideList>
          </div>
        )
      }
      {
        conversationId ? (
          <ConversationViewer className={styles.conversation} conversationId={conversationId} conversationType={conversationType}
            menuFolded={menuFolded} setMenuFolded={setMenuFolded} refreshConversationList={async (reset) => {
              await refresh(conversationType, reset);
            }}></ConversationViewer>
        ) : (
          <EmptyConversation className={styles.conversation}></EmptyConversation>
        )
      }

      {/* 添加会话 */}
      <Modal
        title=""
        open={addShown}
        centered={true}
        maskClosable={false}
        onCancel={() => {
          setAddShown(false);
        }}
        footer={null}
      >
        <AddConversation conversationType={conversationType!} onSave={async (addValue: { category: string, name: string, avatar?: string, args?: any } | null) => {
          if (addValue == null) {
            return;
          }
          //
          let res = await createConversation(addValue.category, addValue.name, addValue.avatar, addValue.args);

          if (res && res.length > 0) {
            //发送系统消息
            await createChatMessage(res, conversationType, 'system');
            await refresh(conversationType);
            setConversationId(res);
            setAddShown(false);
          } else {
            //添加失败
          }
        }} onCannel={() => {
          setAddShown(false);
        }}></AddConversation>
      </Modal>
    </>
  );
}

interface ConversationIconProps {
  className?: string,
  conversationType?: string,
  item: any,
}

const ConversationIcon: React.FC<ConversationIconProps> = ({ className, item, conversationType }) => {
  let avatar = item.avatar;
  if (!avatar) {
    avatar = '[class](iconfont icon-a-205shezhi)'
  }

  let splits = avatar.split('](');
  if (!!splits || splits.length >= 2) {
    let avatarType = splits[0].substring(1);
    let content = splits[1].substring(0, splits[1].length - 1);

    if (avatarType === 'class') {
      return (
        <div className={classnames(className, content)}></div>
      );
    } else if (avatarType === 'symbol') {
      return (
        <div className={classnames(className)} style={{ backgroundColor: '#dedede' }}>{content}</div>
      );
    }
  }
  return (
    <div className={classnames(className, 'iconfont icon-a-205shezhi')}></div>
  );
}


export default ConversationPage;