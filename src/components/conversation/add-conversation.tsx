import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { PurposeSelector } from '@/components/util/PurposeSelector';
import { message } from 'antd';
import { defaultChatModelId, ChatModels, ChatModelId, defaultSystemPurposeId, SystemPurposeId, SystemPurposes } from '@/databases/data/index'
import { Box, Button, Grid, Stack, Textarea, Typography, useTheme } from '@mui/joy';
import { StyledDropdown } from '@/components/util/StyledDropdown';
import { AddPainterConversation, getPainterDefaultArgs } from '@/components/painter/index';

import styles from './add-conversation.less';

interface _ChatGPTProps {
    model: ChatModelId;
    name: string;
    systemPurposeId: SystemPurposeId;
    onModelChange: (value: ChatModelId) => void;
    onCustomMessageChange: (value: string) => void;
    onSystemPurposeIdChange: (value: SystemPurposeId) => void;
    onNameChange: (value: string) => void;
}

const _ChatGPT: React.FC<_ChatGPTProps> = ({ name, model, onModelChange, onCustomMessageChange, systemPurposeId, onSystemPurposeIdChange, onNameChange }) => {

    const handleEditTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onNameChange(e.target.value);
    }

    return (
        <div>
            <Box sx={{ marginTop: '10px' }}>
                <Typography level='body3' color='neutral' sx={{ mb: 2 }}>
                    会话名称：
                </Typography>
                <Textarea maxRows={2} value={name} onChange={handleEditTextChanged}></Textarea>
            </Box>
            <Box sx={{ marginTop: '10px' }}>
                <Typography level='body3' color='neutral' sx={{ mb: 2 }}>
                    模型选择：
                </Typography>
                <StyledDropdown items={ChatModels} value={model} onChange={(event: any, value: ChatModelId | null) => {
                    if (value) {
                        onModelChange(value);
                    }
                }} />
            </Box>
            <PurposeSelector sx={{ marginTop: '10px' }}
                systemPurposeId={systemPurposeId} handlePurposeChange={(purpose: SystemPurposeId | null) => {
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

export interface AddConversationProps {
    conversationType: string,
    onSave: (value: any) => Promise<any>,
    onCannel: () => void,
}

const getDefaultArgs = (conversationType: string) => {
    if (conversationType == 'chat') {
        return {
            model: defaultChatModelId,
            purposeId: defaultSystemPurposeId,
            customMessage: ''
        };
    } else if (conversationType === 'painter') {
        return getPainterDefaultArgs();
    }
    return {};
};


export const AddConversation: React.FC<AddConversationProps> = ({ conversationType, onSave, onCannel }) => {

    const [messageApi, contextHolder] = message.useMessage();

    const theme = useTheme();

    const [name, setName] = useState<string>('');

    const [args, setArgs] = useState<any>(getDefaultArgs(conversationType));

    const content = (conversationType: string) => {
        if (conversationType === 'chat') {
            return (
                <_ChatGPT
                    name={name}
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
                    onNameChange={(name) => {
                        setName(name)
                    }}

                ></_ChatGPT>
            );
        } else if (conversationType === 'painter') {
            return (
                <AddPainterConversation
                    name={name}
                    args={args}
                    onArgsChange={(args) => {
                        setArgs(args);
                    }}
                    onNameChange={(name) => {
                        setName(name)
                    }}

                ></AddPainterConversation>
            );
        }
        return <></>;
    };


    return (
        <div className={classnames(styles.container)}>
            {contextHolder}
            {content(conversationType)}
            <Stack direction='row' sx={{ justifyContent: 'flex-start', alignItems: 'center', mx: 2, gap: { xs: 2, lg: 3 }, }}>
                <Button
                    variant={'solid'}
                    color={'primary'}
                    onClick={async () => {
                        //组装数据
                        let conversation = {};
                        if (conversationType === 'chat') {

                            let cname: string = name;
                            if (!cname || cname.trim() == '') {
                                cname = `${SystemPurposes[args['purposeId'] as SystemPurposeId]?.title}`;
                            }
                            if (cname.length > 64) {
                                messageApi.open({
                                    type: 'error',
                                    content: '会话名称过长~',
                                });
                                return;
                            }
                            //
                            conversation = {
                                avatar: `[symbol](${SystemPurposes[args['purposeId'] as SystemPurposeId]?.symbol})`,
                                name: cname,
                                category: conversationType,
                                args: args
                            };
                        } else if (conversationType === 'painter') {
                            let cname: string = name;
                            if (!cname || cname.trim() == '') {
                                cname = `绘画`;
                            }
                            if (cname.length > 64) {
                                messageApi.open({
                                    type: 'error',
                                    content: '会话名称过长~',
                                });
                                return;
                            }
                            //
                            conversation = {
                                avatar: `[symbol](👩‍💻)`,
                                name: cname,
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

