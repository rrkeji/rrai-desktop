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

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: abortSignal,
    });

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      // loop forever until the read is done, or the abort controller is triggered
      let incrementalText = '';
      let parsedFirstPacket = false;
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        incrementalText += decoder.decode(value);

        // there may be a JSON object at the beginning of the message, which contains the model name (streaming workaround)
        if (!parsedFirstPacket && incrementalText.startsWith('{')) {
          const endOfJson = incrementalText.indexOf('}');
          if (endOfJson > 0) {
            const json = incrementalText.substring(0, endOfJson + 1);
            incrementalText = incrementalText.substring(endOfJson + 1);
            try {
              const parsed = JSON.parse(json);
              editMessage(conversationId, messageId, { modelId: parsed.model }, false);
              parsedFirstPacket = true;
            } catch (e) {
              // error parsing JSON, ignore
              console.log('Error parsing JSON: ' + e);
            }
          }
        }

        editMessage(conversationId, messageId, { text: incrementalText }, false);
      }
    }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      // expected, the user clicked the "stop" button
    } else {
      // TODO: show an error to the UI
      console.error('Fetch request error:', error);
    }
  }

  // finally, stop the typing animation
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

      <ConversationBar
        onClearConversation={handleClearConversation}
        onDownloadConversationJSON={handleDownloadConversationToJson}
        onShowSettings={props.onShowSettings}
        sx={{
          position: 'sticky', top: 0, zIndex: 20,
          background: '#E4E4E4',
        }} />

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
