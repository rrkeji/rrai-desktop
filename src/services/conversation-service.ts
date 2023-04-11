import { TConversation } from '@/lib/conversation';

export const getConversationsByType = async (conversationType: string): Promise<any> => {

    let data = [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => {
        return {
            id: item + '',
            title: '会话' + item
        } as TConversation;
    });
    return {
        total: 10,
        data: data
    };
}