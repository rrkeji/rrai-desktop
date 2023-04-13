
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


export interface TMessage {
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