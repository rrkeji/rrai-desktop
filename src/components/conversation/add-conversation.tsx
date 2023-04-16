import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { PurposeSelector } from '@/components/util/PurposeSelector';
import { Input, Select, Row, Col } from 'antd';
import { defaultChatModelId, ChatModels, ChatModelId, defaultSystemPurposeId, SystemPurposeId, SystemPurposes } from '@/databases/data/index'
import { Box, Button, Grid, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import { StyledDropdown } from '@/components/util/StyledDropdown';
import styles from './add-conversation.less';

export interface AddConversationProps {
    conversationType: string,
    onSave: (value: any) => Promise<any>,
    onCannel: () => void,
}

interface _ChatGPTProps {
    model: ChatModelId,
    systemPurposeId: SystemPurposeId,
    onModelChange: (value: ChatModelId) => void,
    onCustomMessageChange: (value: string) => void,
    onSystemPurposeIdChange: (value: SystemPurposeId) => void,
}

const _ChatGPT: React.FC<_ChatGPTProps> = ({ model, onModelChange, onCustomMessageChange, systemPurposeId, onSystemPurposeIdChange }) => {

    return (
        <div>
            <Box>
                <Typography level='body3' color='neutral' sx={{ mb: 2 }}>
                    模型选择：
                </Typography>
                <StyledDropdown items={ChatModels} value={model} onChange={(event: any, value: ChatModelId | null) => {
                    if (value) {
                        onModelChange(value);
                    }
                }} />
            </Box>
            <PurposeSelector systemPurposeId={systemPurposeId} handlePurposeChange={(purpose: SystemPurposeId | null) => {
                if (purpose) {
                    onSystemPurposeIdChange(purpose);
                }
            }}
                handleCustomSystemMessageChange={(event) => {
                    console.log(event.target.value);
                    onCustomMessageChange(event.target.value)
                }}
            />
        </div>
    );
}


const getDefaultArgs = (conversationType: string) => {
    if (conversationType == 'chat') {
        return {
            model: defaultChatModelId,
            purposeId: defaultSystemPurposeId,
            customMessage: ''
        };
    }
    return {};
};


export const AddConversation: React.FC<AddConversationProps> = ({ conversationType, onSave, onCannel }) => {

    const theme = useTheme();

    const [args, setArgs] = useState<any>(getDefaultArgs(conversationType));

    const content = (conversationType: string) => {
        if (conversationType === 'chat') {
            return (
                <_ChatGPT
                    model={args['model']}
                    onModelChange={(value) => {
                        setArgs({ ...args, model: value });
                    }}
                    onCustomMessageChange={(customMessage: string) => {
                        setArgs({ ...args, customMessage: customMessage });
                    }}
                    systemPurposeId={args['purposeId']}
                    onSystemPurposeIdChange={(systemPurposeId: SystemPurposeId) => {
                        setArgs({ ...args, purposeId: systemPurposeId });
                    }}

                ></_ChatGPT>
            );
        }
        return <></>;
    };


    return (
        <div className={classnames(styles.container)}>
            {content(conversationType)}
            <Stack direction='row' sx={{ justifyContent: 'flex-start', alignItems: 'center', mx: 2, gap: { xs: 2, lg: 3 }, }}>
                <Button
                    variant={'solid'}
                    color={'primary'}
                    onClick={async () => {
                        //组装数据
                        let conversation = {};
                        if (conversationType === 'chat') {
                            //
                            conversation = {
                                avatar: `[symbol](${SystemPurposes[args['purposeId'] as SystemPurposeId]?.symbol})`,
                                name: `${SystemPurposes[args['purposeId'] as SystemPurposeId]?.title}`,
                                category: conversationType,
                                args: args
                            };
                        }
                        await onSave(conversation);
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
                        onCannel();
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