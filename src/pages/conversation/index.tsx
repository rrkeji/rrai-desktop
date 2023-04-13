import { useCallback, useEffect, useState } from 'react';

import { history, useLocation, useParams } from 'umi';
import classnames from 'classnames';
import { SideList, SideListItem, SideHeader, MessageList, ComposerFacade } from '@/components/index';
import { ConversationBar, AddConversation } from '@/components/conversation/index';
import { Drawer, Modal } from 'antd';
import { getConversationsByType, createConversation } from '@/services/conversation-service';

import { getLocalValue } from '@/utils';

import styles from './index.less';
import { ConversationEntity } from '@/databases';

export const ConversationPage = () => {

  const location = useLocation();

  // {conversationType,conversationId}
  const params = useParams<string>();

  const active = params.conversationType;

  const [items, setItems] = useState<Array<any>>([]);

  const [menuFolded, setMenuFolded] = useState<boolean>(false);

  const [addShown, setAddShown] = useState<boolean>(false);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [conversationId, setConversationId] = useState<string | null>(null);

  const [addValue, setAddValue] = useState<{ category: string, name: string, avatar?: string, args?: any } | null>(null);

  const [conversationTitle, setConversationTitle] = useState<string | null>(null);

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    const call = async () => {
      if (active != null) {
        //根据会话类型获取所有的会话
        let response: any = await getConversationsByType(active);
        console.log(response);

        if (response && response.data) {
          setItems(response.data);
        } else {
          setItems([]);
        }
      }
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

  console.log(active, params.conversationType);

  return (
    <>
      {
        menuFolded ? ('') : (
          <SideList className={styles.side}>
            <div data-tauri-drag-region className={styles.height24}></div>
            <SideHeader activeModule={active!} className={styles.side_header} onAddConversation={async (conversationType) => {
              //弹出对话框
              setAddShown(true);
            }}></SideHeader>
            {
              items && items.map((item: any, index: number) => {
                return (
                  <SideListItem
                    key={index}
                    className={classnames(styles.side_item)}
                    active={item.id === conversationId}
                    title={item.name}
                    avatar={<div className={classnames(styles.side_item_avatar, "iconfont icon-a-205shezhi")}></div>}
                    avatarBackground={'#0493F5'}
                    onClick={() => {
                      setConversationId(item.id);
                      setConversationTitle(item.name);
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
          <MessageList className={styles.message_list}></MessageList>
          <ComposerFacade
            height={300}
            className={styles.composer}
            disableSend={!!abortController}
            conversationType={active!}
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

        <Modal
          title="添加"
          open={addShown}
          centered={true}
          maskClosable={false}
          onOk={async () => {
            if (addValue == null) {
              return;
            }
            //
            let res = await createConversation(addValue.category, addValue.name, addValue.avatar, addValue.args);
            console.log(res);

            setAddShown(false);
          }}
          onCancel={() => {
            setAddShown(false);
          }}
          okText="确认"
          cancelText="取消"
        >
          <AddConversation conversationType={active!} value={addValue} onChange={(value) => {
            setAddValue(value);
          }}></AddConversation>
        </Modal>

      </div>
    </>
  );
}


export default ConversationPage;