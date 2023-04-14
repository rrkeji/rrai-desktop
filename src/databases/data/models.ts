export type ChatModelId = 'gpt-4' | 'gpt-3.5-turbo';

export const defaultChatModelId: ChatModelId = 'gpt-3.5-turbo';

type ChatModelData = {
    description: string | JSX.Element;
    title: string;
    fullName: string; // seems unused
    contextWindowSize: number,
}

export const ChatModels: { [key in ChatModelId]: ChatModelData } = {
    'gpt-4': {
        description: 'Most insightful, larger problems, but slow, expensive, and may be unavailable',
        title: 'GPT-4',
        fullName: 'GPT-4',
        contextWindowSize: 8192,
    },
    'gpt-3.5-turbo': {
        description: 'A good balance between speed and insight',
        title: '3.5-Turbo',
        fullName: 'GPT-3.5 Turbo',
        contextWindowSize: 4096,
    },
};