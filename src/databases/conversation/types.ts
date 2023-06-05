
export interface ConversationEntity {
    id: number;
    uid: string;
    avatar?: string;
    name: string;
    category: string;
    args: any;
    created: number;
    updated: number;
}


export interface MessageEntity {
    id: number;
    senderType: 'You' | 'Bot' | 'Person' | 'system';
    senderId: string;
    avatar: string | null;

    botRole: 'assistant' | 'system' | 'user';
    modelId?: string;
    modelOptions?: string;

    text: string;
    typing: boolean;
    purposeId?: string;

    cacheTokensCount?: number;

    is_shared: number;
    shared_message_id: string;

    created: number;
    updated: number | null;
}

export type ChatConversationArgs = {
    aiModelId: string,
    purposeId: string,
    cacheTokensCount?: number;
};

export type PainterConversationArgs = {
    aiModel: string,
};