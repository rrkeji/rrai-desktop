import * as React from 'react';

import { IconButton, ListDivider, ListItem, ListItemDecorator, Menu, MenuItem, Sheet, Stack, Switch, Typography, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { MoreOutlined, UngroupOutlined, MenuOutlined } from '@ant-design/icons';

import {
  CopyOutlined as AddIcon,
  FieldBinaryOutlined as DarkModeIcon,
  CaretDownOutlined as DeleteOutlineIcon,
  AudioOutlined as ExitToAppIcon,
  CaretDownOutlined as FileDownloadIcon,
  CaretDownOutlined as SettingsOutlinedIcon,
  CaretDownOutlined as SettingsSuggestIcon,
  CaretDownOutlined as SwapVertIcon,
} from '@ant-design/icons';

import { ChatModelId, ChatModels, SystemPurposeId, SystemPurposes } from '@/lib/data';
import { Link } from '@/components/util/Link';
import { StyledDropdown } from '@/components/util/StyledDropdown';
import { foolsMode } from '@/lib/theme';
import { shallow } from 'zustand/shallow';
import { useActiveConfiguration, useChatStore, useConversationNames } from '@/lib/store-chats';
import { useSettingsStore } from '@/lib/store-settings';


/**
 * FIXME - TEMPORARY - placeholder for a proper Pages Drawer
 */
function PagesMenu(props: { pagesMenuAnchor: HTMLElement | null, onClose: () => void, onClearConversation: (e: React.MouseEvent, conversationId: string) => void }) {

  // external state
  const setActiveConversation = useChatStore(state => state.setActiveConversationId);
  const conversationNames: { id: string; name: string, systemPurposeId: SystemPurposeId }[] = useConversationNames();

  const handleConversationClicked = (conversationId: string) => setActiveConversation(conversationId);

  return <Menu
    variant='plain' color='neutral' size='lg' placement='bottom-start' sx={{ minWidth: 280 }}
    open={!!props.pagesMenuAnchor} anchorEl={props.pagesMenuAnchor} onClose={props.onClose}
    disablePortal={false}>

    <ListItem>
      <Typography level='body2'>
        Active chats
      </Typography>
    </ListItem>

    {conversationNames.map((conversation) => (
      <MenuItem
        key={'c-id-' + conversation.id}
        onClick={() => handleConversationClicked(conversation.id)}
      >

        <ListItemDecorator>
          {SystemPurposes[conversation.systemPurposeId]?.symbol || ''}
        </ListItemDecorator>

        <Typography sx={{ mr: 2 }}>
          {conversation.name}
        </Typography>

        <IconButton
          variant='soft' color='neutral' sx={{ ml: 'auto' }}
          onClick={e => props.onClearConversation(e, conversation.id)}>
          <DeleteOutlineIcon />
        </IconButton>

      </MenuItem>
    ))}

    <MenuItem disabled={true}>
      <ListItemDecorator><AddIcon /></ListItemDecorator>
      <Typography sx={{ opacity: 0.5 }}>
        New chat (soon)
        {/* We need stable Chat and Message IDs, and one final review to the data structure of Conversation for future-proofing */}
      </Typography>
    </MenuItem>


    <ListItem>
      <Typography level='body2'>
        Scratchpad
      </Typography>
    </ListItem>

    <MenuItem>
      <ListItemDecorator />
      <Typography sx={{ opacity: 0.5 }}>
        Feature <Link href='https://github.com/enricoros/nextjs-chatgpt-app/issues/17' target='_blank'>#17</Link>
      </Typography>
    </MenuItem>

  </Menu>;
}


/**
 * The top bar of the application, with the model and purpose selection, and menu/settings icons
 */
export function ApplicationBar({ onClearConversation, onDownloadConversationJSON, onPublishConversation, onShowSettings, sx }: {
  onClearConversation: (conversationId: (string | null)) => void;
  onDownloadConversationJSON: (conversationId: (string | null)) => void;
  onPublishConversation: (conversationId: (string | null)) => void;
  onShowSettings: () => void;
  sx?: SxProps
}) {
  // state
  const [pagesMenuAnchor, setPagesMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [actionsMenuAnchor, setActionsMenuAnchor] = React.useState<HTMLElement | null>(null);

  // external state
  const { mode: colorMode, setMode: setColorMode } = useColorScheme();
  const { freeScroll, setFreeScroll, showSystemMessages, setShowSystemMessages } = useSettingsStore(state => ({
    freeScroll: state.freeScroll, setFreeScroll: state.setFreeScroll,
    showSystemMessages: state.showSystemMessages, setShowSystemMessages: state.setShowSystemMessages,
  }), shallow);
  const { chatModelId, setChatModelId, setSystemPurposeId, systemPurposeId } = useActiveConfiguration();


  const handleChatModelChange = (event: any, value: ChatModelId | null) => value && setChatModelId(value);

  const handleSystemPurposeChange = (event: any, value: SystemPurposeId | null) => value && setSystemPurposeId(value);


  const closePagesMenu = () => setPagesMenuAnchor(null);


  const closeActionsMenu = () => setActionsMenuAnchor(null);

  const handleDarkModeToggle = () => setColorMode(colorMode === 'dark' ? 'light' : 'dark');

  const handleScrollModeToggle = () => setFreeScroll(!freeScroll);

  const handleSystemMessagesToggle = () => setShowSystemMessages(!showSystemMessages);

  const handleActionShowSettings = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowSettings();
    closeActionsMenu();
  };

  const handleActionDownloadChatJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownloadConversationJSON(null);
  };

  const handleActionPublishChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPublishConversation(null);
  };

  const handleActionClearConversation = (e: React.MouseEvent, id: string | null) => {
    e.stopPropagation();
    onClearConversation(id || null);
  };


  return <>

    {/* Top Bar with 2 icons and Model/Purpose selectors */}
    <Sheet
      variant='solid' color='neutral' invertedColors
      sx={{
        p: 1,
        display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        ...(sx || {}),
      }}>

      {/* TODO ICON */}
      <IconButton variant='plain' onClick={event => setPagesMenuAnchor(event.currentTarget)}>
        {foolsMode ? <UngroupOutlined /> : <MenuOutlined />}
      </IconButton>

      <Stack direction='row' sx={{ my: 'auto' }}>
        <StyledDropdown items={ChatModels} value={chatModelId} onChange={handleChatModelChange} />
        <StyledDropdown items={SystemPurposes} value={systemPurposeId} onChange={handleSystemPurposeChange} />
      </Stack>

      <IconButton variant='plain' onClick={event => setActionsMenuAnchor(event.currentTarget)}>
        <MoreOutlined />
      </IconButton>
    </Sheet>


    {/* Left menu */}
    {<PagesMenu
      pagesMenuAnchor={pagesMenuAnchor}
      onClose={closePagesMenu}
      onClearConversation={handleActionClearConversation}
    />}


    {/* Right menu */}
    <Menu
      variant='plain' color='neutral' size='lg' placement='bottom-end' sx={{ minWidth: 280 }}
      open={!!actionsMenuAnchor} anchorEl={actionsMenuAnchor} onClose={closeActionsMenu}
      disablePortal={false}>

      <MenuItem>
        <ListItemDecorator><DarkModeIcon /></ListItemDecorator>
        Dark
        <Switch checked={colorMode === 'dark'} onChange={handleDarkModeToggle} sx={{ ml: 'auto' }} />
      </MenuItem>

      <MenuItem>
        <ListItemDecorator><SettingsSuggestIcon /></ListItemDecorator>
        System text
        <Switch checked={showSystemMessages} onChange={handleSystemMessagesToggle} sx={{ ml: 'auto' }} />
      </MenuItem>

      <MenuItem>
        <ListItemDecorator><SwapVertIcon /></ListItemDecorator>
        Free scroll
        <Switch checked={freeScroll} onChange={handleScrollModeToggle} sx={{ ml: 'auto' }} />
      </MenuItem>

      <MenuItem onClick={handleActionShowSettings}>
        <ListItemDecorator><SettingsOutlinedIcon /></ListItemDecorator>
        Settings
      </MenuItem>

      <ListDivider />

      <MenuItem onClick={handleActionDownloadChatJson}>
        <ListItemDecorator>
          {/*<Badge size='sm' color='danger'>*/}
          <FileDownloadIcon />
          {/*</Badge>*/}
        </ListItemDecorator>
        Download JSON
      </MenuItem>

      <MenuItem onClick={handleActionPublishChat}>
        <ListItemDecorator>
          {/*<Badge size='sm' color='primary'>*/}
          <ExitToAppIcon />
          {/*</Badge>*/}
        </ListItemDecorator>
        Share via paste.gg
      </MenuItem>

      <ListDivider />

      <MenuItem onClick={e => handleActionClearConversation(e, null)}>
        <ListItemDecorator><DeleteOutlineIcon /></ListItemDecorator>
        Clear conversation
      </MenuItem>
    </Menu>

  </>;
}