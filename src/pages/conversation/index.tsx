import { useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader, MessageList, ComposerFacade } from '@/components/index';
import { ConversationBar, AddConversation } from '@/components/conversation/index';
import { Drawer, Modal } from 'antd';
import { getConversationsByType, createConversation } from '@/services/conversation-service';
import { createChatMessage } from '@/services/message-service';

import { getLocalValue } from '@/utils';

import styles from './index.less';
import { ConversationEntity } from '@/databases';

export const ConversationPage = () => {

  const location = useLocation();

  // {conversationType,conversationId}
  const params = useParams<string>();

  const conversationType = params.conversationType;

  const [items, setItems] = useState<Array<any>>([]);

  const [menuFolded, setMenuFolded] = useState<boolean>(false);

  const [addShown, setAddShown] = useState<boolean>(false);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [conversationTitle, setConversationTitle] = useState<string | null>(null);

  const [abortController, setAbortController] = useState<AbortController | null>(null);


  const refresh = async () => {
    if (conversationType != null) {
      //根据会话类型获取所有的会话
      let response: any = await getConversationsByType(conversationType);
      console.log(response);

      if (response && response.data) {
        setItems(response.data);
      } else {
        setItems([]);
      }
    }
  };

  useEffect(() => {
    const call = async () => {

      refresh();
    };
    call();
  }, []);

  //
  useEffect(() => {
    if (params.conversationId) {
      setConversationId(params.conversationId);
    } else {
      setConversationId(null);
    }
  }, [params.conversationId]);


  const handleSendMessage = async (userText: string, conversationId: string | null) => {
    //
    // const conversation = findConversation(conversationId || activeConversationId);
    // if (conversation)
    //   await runAssistant(conversation.id, [...conversation.messages, createDMessage('user', userText)]);
  };

  const handleStopGeneration = () => abortController?.abort();

  console.log(conversationType, params.conversationType);

  return (
    <>
      {
        menuFolded ? ('') : (
          <SideList className={styles.side}>
            <div data-tauri-drag-region className={styles.height24}></div>
            <SideHeader activeModule={conversationType!} className={styles.side_header} onAddConversation={async (conversationType) => {
              //弹出对话框
              setAddShown(true);
            }}></SideHeader>
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
                    onClick={() => {
                      setConversationId(item.uid);
                      setConversationTitle(item.name);
                      // history.replace(`/conversation/${conversationType}/${item.id}`);
                      // history.push(`/conversation/${conversationType}/${item.id}`);
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
          <MessageList className={styles.message_list}
            conversationId={conversationId!} conversationType={conversationType} conversationName={conversationTitle!}></MessageList>
          <ComposerFacade
            height={300}
            className={styles.composer}
            disableSend={!!abortController}
            conversationType={conversationType!}
            conversationId={conversationId!}
            sendMessage={handleSendMessage}
            stopGeneration={handleStopGeneration}
          ></ComposerFacade>
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
              await refresh();
              setConversationId(res);
              setConversationTitle(addValue.name);
              setAddShown(false);
            } else {
              //添加失败
            }
          }} onCannel={() => {
            setAddShown(false);
          }}></AddConversation>
        </Modal>

      </div>
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