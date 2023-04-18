import React, { ReactNode } from 'react';
import { MessageEntity } from '@/databases/conversation/index';
import { SxProps } from '@mui/joy/styles/types';

//
export type BlockData = TextBlockData | CodeBlockData;

export type TextBlockData = { type: 'text'; content: string; };

export type CodeBlockData = { type: 'code'; content: string; language: string | null; complete: boolean; code: string; };

export interface BlockViewerProps {
    className?: string;
    appending?: boolean;
    data: BlockData;
    sx?: SxProps;
}

export interface BlockEditorProps {
    className?: string;
    appending?: boolean;
    data: BlockData;
    onEditCompleted: (text: string) => Promise<any>;
    sx?: SxProps;
}

export const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined')
        navigator.clipboard.writeText(text)
            .then(() => console.log('Message copied to clipboard'))
            .catch((err) => console.error('Failed to copy message: ', err));
}
