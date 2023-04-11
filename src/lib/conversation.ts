
export interface TMessage {
    id: string;
    text: string;
    sender: 'You' | 'Bot' | string;   // pretty name
    avatar: string | null;            // null, or image url
    typing: boolean;
    role: 'assistant' | 'system' | 'user';

    modelId?: string;                 // only assistant - goes beyond known models
    purposeId?: string;      // only assistant/system
    cacheTokensCount?: number;

    created: number;                  // created timestamp
    updated: number | null;           // updated timestamp
}


export type TConversationType = 'chat' | 'painter' | 'prompts' | 'tools' | 'settings';


export type ChatConversationArgs = {
    aiModelId: string,
    purposeId: string,
    cacheTokensCount?: number;
};

export type PainterConversationArgs = {
    aiModel: string,
};

export interface TConversation {
    id: string;
    avatar?: string;
    title: string;
    type: TConversationType;
    args: ChatConversationArgs | PainterConversationArgs;
    created: number;            // created timestamp
    updated: number | null;     // updated timestamp
}