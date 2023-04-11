import * as React from 'react';

import { Box, Stack, useTheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

import { ConversationBar } from '@/components/conversation/index';
import { ChatMessageList } from '@/components/chat/index';
import { Composer } from '@/components/composer/index';
import { ConfirmationModal } from '@/components/dialogs/ConfirmationModal';
import { DMessage, downloadConversationJson, useActiveConfiguration, useChatStore } from '@/lib/store-chats';
import { SystemPurposes } from '@/lib/data';
import { useSettingsStore } from '@/lib/store-settings';


function createDMessage(role: DMessage['role'], text: string): DMessage {
  return {
    id: Math.random().toString(36).substring(2, 15), // use uuid4 !!
    text: text,
    sender: role === 'user' ? 'You' : 'Bot',
    avatar: null,
    typing: false,
    role: role,
    created: Date.now(),
    updated: null,
  };
}


/**
 * Main function to send the chat to the assistant and receive a response (streaming)
 */
async function _streamAssistantResponseMessage(
  conversationId: string, history: DMessage[],
  chatModelId: string, modelTemperature: number, modelMaxResponseTokens: number, abortSignal: AbortSignal,
  addMessage: (conversationId: string, message: DMessage) => void,
  editMessage: (conversationId: string, messageId: string, updatedMessage: Partial<DMessage>, touch: boolean) => void,
) {

  const assistantMessage: DMessage = createDMessage('assistant', '...');
  assistantMessage.typing = true;
  assistantMessage.modelId = chatModelId;
  assistantMessage.purposeId = history[0].purposeId;
  addMessage(conversationId, assistantMessage);
  const messageId = assistantMessage.id;

  const payload: any = {
    model: chatModelId,
    messages: history.map(({ role, text }) => ({
      role: role,
      content: text,
    })),
    temperature: modelTemperature,
    max_tokens: modelMaxResponseTokens,
  };

  console.log(payload.messages, '====');

  try {

    const requestWebsocket = (payload, resolve, reject): Promise<any> => {

      return new Promise((resolve, reject) => {
        let websocket = new WebSocket('ws://45.207.58.161:3001');

        //调用接口
        let incrementalText = '';
        //payload.messages[payload.messages.length - 1].content
        websocket.onopen = (evt) => {
          console.log(evt);
          setTimeout(() => {
            websocket.send(JSON.stringify({
              cmd: "ChatGPT_Text",
              args: {
                "prompt": payload.messages,
                "temperature": 0
              }
            }));
          }, 2000);
        };
        websocket.onclose = function (evt) {
        };
        websocket.onmessage = function (res) {
          let messageStr = res.data;
          console.log('接收到的数据:', messageStr, typeof (messageStr));
          if (!messageStr) {
            console.error("messageStr为空");
            return;
          }
          let messageObj: any = {};
          try {
            messageObj = JSON.parse(messageStr);
          } catch (error) {
            console.error("解析json失败");
            return;
          }
          if (messageObj.cmd === 'Error') {
            //错误
            resolve(messageStr);
            return;
          } else if (messageObj.cmd === 'Response' && messageObj.src !== '') {
            //普通的命令返回
            try {
              //调用处理函数
              resolve(messageObj.message);
            } catch (error) {
              console.log(error);
            }
          } else if (messageObj.cmd === 'Stream' && messageObj.message !== '') {
            //Stream
            try {
              //调用处理函数
              incrementalText += messageObj.message;
              editMessage(conversationId, messageId, { text: incrementalText }, false);
            } catch (error) {
              console.log(error);
            }
          }
        };
        websocket.onerror = function (evt) {
          reject();
        };
      });
    };

    let res = await requestWebsocket(payload, (res) => { }, (err) => { });
    console.log(res);
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      // expected, the user clicked the "stop" button
    } else {
      // TODO: show an error to the UI
      console.error('Fetch request error:', error);
    }
  }

  editMessage(conversationId, messageId, { typing: false }, false);
}


export function Chat(props: { onShowSettings: () => void, sx?: SxProps }) {
  // state
  const [clearConfirmationId, setClearConfirmationId] = React.useState<string | null>(null);
  const [abortController, setAbortController] = React.useState<AbortController | null>(null);

  // external state
  const theme = useTheme();
  const setMessages = useChatStore(state => state.setMessages);
  const { conversationId: activeConversationId, chatModelId, systemPurposeId } = useActiveConfiguration();

  const runAssistant = async (conversationId: string, history: DMessage[]) => {
    // update the purpose of the system message (if not manually edited), and create if needed
    {
      const systemMessageIndex = history.findIndex(m => m.role === 'system');
      const systemMessage: DMessage = systemMessageIndex >= 0 ? history.splice(systemMessageIndex, 1)[0] : createDMessage('system', '');

      if (!systemMessage.updated) {
        systemMessage.purposeId = systemPurposeId;
        systemMessage.text = SystemPurposes[systemPurposeId].systemMessage
          .replaceAll('{{Today}}', new Date().toISOString().split('T')[0]);
      }

      history.unshift(systemMessage);
    }

    // use the new history
    setMessages(conversationId, history);

    // when an abort controller is set, the UI switches to the "stop" mode
    const controller = new AbortController();
    setAbortController(controller);

    const { modelTemperature, modelMaxResponseTokens } = useSettingsStore.getState();
    const { appendMessage, editMessage } = useChatStore.getState();
    console.log(history, 'history');

    await _streamAssistantResponseMessage(conversationId, history, chatModelId, modelTemperature, modelMaxResponseTokens, controller.signal, appendMessage, editMessage);

    // clear to send, again
    setAbortController(null);
  };

  const handleStopGeneration = () => abortController?.abort();

  const findConversation = (conversationId: string) =>
    (conversationId ? useChatStore.getState().conversations.find(c => c.id === conversationId) : null) ?? null;

  const handleSendMessage = async (userText: string, conversationId: string | null) => {
    const conversation = findConversation(conversationId || activeConversationId);
    if (conversation)
      await runAssistant(conversation.id, [...conversation.messages, createDMessage('user', userText)]);
  };

  const handleDownloadConversationToJson = (conversationId: string | null) => {
    if (conversationId || activeConversationId) {
      const conversation = findConversation(conversationId || activeConversationId);
      if (conversation)
        downloadConversationJson(conversation);
    }
  };

  const handleClearConversation = (conversationId: string | null) =>
    setClearConfirmationId(conversationId || activeConversationId || null);

  const handleConfirmedClearConversation = () => {
    if (clearConfirmationId) {
      setMessages(clearConfirmationId, []);
      setClearConfirmationId(null);
    }
  };


  return (
    <Stack
      sx={{
        minHeight: '100vh',
        position: 'relative',
        ...(props.sx || {}),
      }}>

      <ChatMessageList
        disableSend={!!abortController} runAssistant={runAssistant}
        sx={{
          flexGrow: 1,
          background: theme.vars.palette.background.level2,
          overflowY: 'hidden',
          marginBottom: '-1px',
        }} />

      <Box
        sx={{
          position: 'sticky', bottom: 0, zIndex: 21,
          background: theme.vars.palette.background.surface,
          borderTop: `1px solid ${theme.vars.palette.divider}`,
          p: { xs: 1, md: 2 },
        }}>
        <Composer
          disableSend={!!abortController} isDeveloperMode={systemPurposeId === 'Developer'}
          sendMessage={handleSendMessage} stopGeneration={handleStopGeneration}
        />
      </Box>

      {/* Confirmation for Delete */}
      <ConfirmationModal
        open={!!clearConfirmationId} onClose={() => setClearConfirmationId(null)} onPositive={handleConfirmedClearConversation}
        confirmationText={'Are you sure you want to discard all the messages?'} positiveActionText={'Clear conversation'}
      />
    </Stack>
  );
}
