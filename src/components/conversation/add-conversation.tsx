import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { PurposeSelector } from '@/components/util/PurposeSelector';
import { Input, Select, Row, Col } from 'antd';
import { defaultChatModelId, ChatModels, ChatModelId, defaultSystemPurposeId, SystemPurposeId } from '@/databases/data/index'
import { Box, Button, Grid, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import { StyledDropdown } from '@/components/util/StyledDropdown';
import styles from './add-conversation.less';

export interface AddConversationProps {
    conversationType: string,
    onSave: (value: any) => Promise<any>,
    onCannel: () => void,
}

interface _ChatGPTProps {
    onModelChange: (value: any) => void
}

const _ChatGPT: React.FC<_ChatGPTProps> = ({ onModelChange }) => {

    const [chatModelId, setChatModelId] = useState<ChatModelId>(defaultChatModelId);

    const [systemPurposeId, setSystemPurposeId] = useState<SystemPurposeId>(defaultSystemPurposeId);

    const [customMessage, setCustomMessage] = useState<string>('');

    return (
        <div>
            <Box>
                <Typography level='body3' color='neutral' sx={{ mb: 2 }}>
                    模型选择：
                </Typography>
                <StyledDropdown items={ChatModels} value={chatModelId} onChange={(event: any, value: ChatModelId | null) => {
                    if (value) {
                        setChatModelId(value);
                    }
                }} />
            </Box>
            <PurposeSelector systemPurposeId={systemPurposeId} handlePurposeChange={(purpose: SystemPurposeId | null) => {
                if (purpose) {
                    setSystemPurposeId(purpose);
                }
            }}
                handleCustomSystemMessageChange={(event) => {
                    console.log(event.target.value);
                    setCustomMessage(event.target.value)
                }}
            />
        </div>
    );
}


export const AddConversation: React.FC<AddConversationProps> = ({ conversationType, onSave, onCannel }) => {
    const theme = useTheme();

    const [val, setVal] = useState<any>(null);

    const [name, setName] = useState<string>('');


    const content = (conversationType: string) => {
        if (conversationType === 'chat') {
            return <_ChatGPT></_ChatGPT>;
        }
        return <_ChatGPT></_ChatGPT>;
    };


    return (
        <div className={classnames(styles.container)}>
            {content(conversationType)}
            <Stack direction='row' sx={{ justifyContent: 'flex-start', alignItems: 'center', mx: 2, gap: { xs: 2, lg: 3 }, }}>
                <Button
                    variant={'solid'}
                    color={'primary'}
                    onClick={() => {

                    }}
                    sx={{
                        fontWeight: 500,
                    }}
                >
                    <div style={{ fontSize: '14px' }}>
                        确定
                    </div>
                </Button>
                <Button
                    variant={'soft'}
                    color={'neutral'}
                    onClick={() => {

                    }}
                    sx={{
                        background: theme.vars.palette.background.level1,
                        fontWeight: 500,
                    }}
                >
                    <div style={{ fontSize: '14px' }}>
                        取消
                    </div>
                </Button>
            </Stack>
        </div>
    );
};

export default AddConversation;