import React, { ReactNode } from 'react';
import { MessageEntity } from '@/databases/conversation/index';


//
export type BlockData = TextBlockData | CodeBlockData;

export type TextBlockData = { type: 'text'; content: string; };

export type CodeBlockData = { type: 'code'; content: string; language: string | null; complete: boolean; code: string; };

export interface BlockViewerProps {
    className?: string;
    avatar?: JSX.Element | ReactNode;
    avatarMenu?: JSX.Element | ReactNode;
    appending?: boolean;
    data: BlockData;
    appendMessage?: (message: string) => void;
}

export interface BlockEditorProps {
    className?: string;
    avatar?: JSX.Element | ReactNode;
    avatarMenu?: JSX.Element | ReactNode;
    appending?: boolean;
    data: BlockData;
    appendMessage?: (message: string) => void;
}