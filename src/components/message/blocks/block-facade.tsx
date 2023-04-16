

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Alert, Avatar, Box, Button, IconButton, ListDivider, ListItem, ListItemDecorator, Menu, MenuItem, Stack, Textarea, Tooltip, Typography, useTheme } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';

import {
    CopyOutlined as ClearIcon,
    FieldBinaryOutlined as ContentCopyIcon,
    CaretDownOutlined as EditIcon,
    AudioOutlined as Face6Icon,
    CaretDownOutlined as FastForwardIcon,
    MoreOutlined as MoreVertIcon,
    CaretDownOutlined as SettingsSuggestIcon,
    CaretDownOutlined as SmartToyOutlinedIcon,
} from '@ant-design/icons';


import { DMessage } from '@/lib/store-chats';
import { Link } from '@/components/util/Link';
import { cssRainbowColorKeyframes, foolsMode } from '@/lib/theme';
import { prettyBaseModel } from '@/lib/publish';
import { useSettingsStore } from '@/lib/store-settings';

import { Block, TextBlock, CodeBlock, inferCodeLanguage, parseBlocks } from './block/index';

import { MessageEntity } from '@/databases/conversation/index';
import classnames from 'classnames';

import { _NormalBlock } from './_normal-block';

import styles from './block-facade.less';

export interface MessageBlockProps {
    className?: string;
    message: MessageEntity;
    appending: boolean;
    appendMessage: (words: string) => void;
}

export const MessageBlock: React.FC<MessageBlockProps> = ({ className, message, appending, appendMessage }) => {
    // theme
    const theme = useTheme();

    const fromAssistant = message.botRole === 'assistant';
    const fromSystem = message.botRole === 'system';
    const fromUser = message.botRole === 'user';
    const wasEdited = false;

    const [isHovering, setIsHovering] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);

    const { isAssistantError, errorMessage } = explainErrorInMessage(message.text, fromAssistant, message.modelId);

    // theming
    let background = theme.vars.palette.background.surface;
    switch (message.botRole) {
        case 'system':
            if (wasEdited)
                background = theme.vars.palette.warning.plainHoverBg;
            break;
        case 'user':
            background = theme.vars.palette.primary.plainHoverBg; // .background.level1
            break;
        case 'assistant':
            if (isAssistantError && !errorMessage)
                background = theme.vars.palette.danger.softBg;
            break;
    }

    return (
        <ListItem sx={{
            display: 'flex', flexDirection: !fromAssistant ? 'row-reverse' : 'row', alignItems: 'flex-start',
            gap: 1, px: { xs: 1, md: 2 }, py: 2,
            background,
            borderBottom: `1px solid ${theme.vars.palette.divider}`,
            // borderBottomColor: `rgba(${theme.vars.palette.neutral.mainChannel} / 0.2)`,
            position: 'relative',
            '&:hover > button': { opacity: 1 },
        }}>
            {/* Avatar */}
            <Stack
                sx={{ alignItems: 'center', minWidth: { xs: 50, md: 64 }, textAlign: 'center' }}
                onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                onClick={(event: any) => setMenuAnchor(event.currentTarget)}>

                {isHovering ? (
                    <IconButton variant='soft' color={fromAssistant ? 'neutral' : 'primary'}>
                        <MoreVertIcon />
                    </IconButton>
                ) : (
                    'avatarEl'
                )}

                {fromAssistant && (
                    <Tooltip title={message.modelId || 'unk-model'} variant='solid'>
                        <Typography level='body2' sx={message.typing
                            ? { animation: `${cssRainbowColorKeyframes} 5s linear infinite`, fontWeight: 500 }
                            : { fontWeight: 500 }
                        }>
                            {prettyBaseModel(message.modelId)}
                        </Typography>
                    </Tooltip>
                )}

            </Stack>

            {message.text}
        </ListItem>
    );
};




function explainErrorInMessage(text: string, isAssistant: boolean, modelId?: string) {
    let errorMessage: JSX.Element | null = null;
    const isAssistantError = isAssistant && (text.startsWith('Error: ') || text.startsWith('OpenAI API error: '));
    if (isAssistantError) {
        if (text.startsWith('OpenAI API error: 429 Too Many Requests')) {
            // TODO: retry at the api/chat level a few times instead of showing this error
            errorMessage = <>
                The model appears to be occupied at the moment. Kindly select <b>GPT-3.5 Turbo</b>,
                or give it another go by selecting <b>Run again</b> from the message menu.
            </>;
        } else if (text.includes('"model_not_found"')) {
            // note that "model_not_found" is different than "The model `gpt-xyz` does not exist" message
            errorMessage = <>
                Your API key appears to be unauthorized for {modelId || 'this model'}. You can change to <b>GPT-3.5 Turbo</b>
                and simultaneously <Link noLinkStyle href='https://openai.com/waitlist/gpt-4-api' target='_blank'>request
                    access</Link> to the desired model.
            </>;
        } else if (text.includes('"context_length_exceeded"')) {
            // TODO: propose to summarize or split the input?
            const pattern: RegExp = /maximum context length is (\d+) tokens.+resulted in (\d+) tokens/;
            const match = pattern.exec(text);
            const usedText = match ? ` (${match[2]} tokens, max ${match[1]})` : '';
            errorMessage = <>
                This thread <b>surpasses the maximum size</b> allowed for {modelId || 'this model'}{usedText}.
                Please consider removing some earlier messages from the conversation, start a new conversation,
                choose a model with larger context, or submit a shorter new message.
            </>;
        } else if (text.includes('"invalid_api_key"')) {
            errorMessage = <>
                The API key appears to not be correct or to have expired.
                Please <Link noLinkStyle href='https://openai.com/account/api-keys' target='_blank'>check your API key</Link> and
                update it in the <b>Settings</b> menu.
            </>;
        }
    }
    return { errorMessage, isAssistantError };
}


export default MessageBlock;