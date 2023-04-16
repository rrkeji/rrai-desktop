import React, { ReactNode } from 'react';
import { MessageEntity } from '@/databases/conversation/index';

export interface BlockViewerProps {
    className?: string;
    avatar?: JSX.Element | ReactNode;
    avatarMenu?: JSX.Element | ReactNode;
    appending?: boolean;
    message: MessageEntity;
    appendMessage?: (message: string) => void;
}

export interface BlockEditorProps {
    className?: string;
    avatar?: JSX.Element | ReactNode;
    avatarMenu?: JSX.Element | ReactNode;
    appending?: boolean;
    message: MessageEntity;
    appendMessage?: (message: string) => void;
}