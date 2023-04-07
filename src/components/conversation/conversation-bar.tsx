import * as React from 'react';

import { IconButton, ListDivider, ListItemDecorator, Menu, MenuItem, Sheet, Stack, Switch, useColorScheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { MoreOutlined, UngroupOutlined, MenuOutlined } from '@ant-design/icons';

import {
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


export function ConversationBar({ onClearConversation, onDownloadConversationJSON, onShowSettings, sx }: {
    onClearConversation: (conversationId: (string | null)) => void;
    onDownloadConversationJSON: (conversationId: (string | null)) => void;
    onShowSettings: () => void;
    sx?: SxProps
}) {
    // state
    const [actionsMenuAnchor, setActionsMenuAnchor] = React.useState<HTMLElement | null>(null);

    // external state
    const { mode: colorMode, setMode: setColorMode } = useColorScheme();
    const { freeScroll, setFreeScroll, showSystemMessages, setShowSystemMessages } = useSettingsStore(state => ({
        freeScroll: state.freeScroll, setFreeScroll: state.setFreeScroll,
        showSystemMessages: state.showSystemMessages, setShowSystemMessages: state.setShowSystemMessages,
    }), shallow);
    const { chatModelId, setChatModelId, setSystemPurposeId, systemPurposeId } = useActiveConfiguration();

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

    const handleActionClearConversation = (e: React.MouseEvent, id: string | null) => {
        e.stopPropagation();
        onClearConversation(id || null);
    };


    return <>
        <Sheet
            variant='solid' color='neutral' invertedColors
            sx={{
                p: 1,
                display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                ...(sx || {}),
            }}>
            <Stack direction='row' sx={{ my: 'auto' }}>
                <div>会话名称</div>
            </Stack>

            <Stack direction='row' sx={{ my: 'auto' }}>
                <IconButton variant='plain' onClick={event => setActionsMenuAnchor(event.currentTarget)}>
                    <MoreOutlined />
                </IconButton>
            </Stack>
        </Sheet>

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

            <ListDivider />

            <MenuItem onClick={e => handleActionClearConversation(e, null)}>
                <ListItemDecorator><DeleteOutlineIcon /></ListItemDecorator>
                Clear conversation
            </MenuItem>
        </Menu>
    </>;
}