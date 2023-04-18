import React, { ReactNode, useState } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { UserAvatar, AssistantAvatar, SystemAvatar } from '@/components/avatars/index';
import { BlockData, UnionBlockProps, UnionEditorBlock, UnionBlock, copyToClipboard } from '@/components/message/blocks/index';
import { DownOutlined, CopyOutlined, EditOutlined, PlaySquareOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { updateMessageTextById, deleteMessageById } from '@/services/message-service';

import type { MenuProps } from 'antd';
import { Dropdown, Space, Modal } from 'antd';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

const { confirm } = Modal;

import styles from './message.less';

export interface MessageProps {
    className?: string;
    editable?: boolean;
    appending?: boolean;
    message: MessageEntity;
    onMessageChange?: () => Promise<any>;
}

export const Message: React.FC<MessageProps> = ({ className, editable, message, appending, onMessageChange }) => {

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const fromAssistant = message.botRole === 'assistant';
    const fromSystem = message.botRole === 'system';
    const fromUser = message.botRole === 'user';

    let collapsedText = message.text;
    let isCollapsed = false;
    if (fromUser) {
        const lines = message.text.split('\n');
        if (lines.length > 10) {
            collapsedText = lines.slice(0, 10).join('\n');
            isCollapsed = true;
        }
    }

    const avatarElement = getAvatarMenu(message.botRole, message.senderType === 'You', editable === undefined ? false : editable,
        (e) => {
            //copy
            copyToClipboard(message.text);
        },
        (e) => {
            //edit
            setIsEditing(!isEditing);
        },
        (e) => {
            //run
        },
        async (e) => {
            //delete
            //确认框
            confirm({
                title: '确定删除?',
                icon: <ExclamationCircleFilled />,
                content: '删除后无法恢复，也可以尝试编辑内容!',
                onOk: async () => {
                    await deleteMessageById(message.id);
                    //刷新
                    onMessageChange && onMessageChange();
                },
                onCancel: () => {
                    console.log('Cancel');
                },
                okText: '确定',
                okType: 'danger',
                cancelText: '取消'
            });
        });


    //只读
    return (
        <div className={classnames(
            styles.container,
            message.botRole === 'user' ? styles.user_message : (message.botRole === 'assistant' ? styles.assistant_message : styles.system_message), className
        )}
            style={{ flexDirection: !fromAssistant ? 'row-reverse' : 'row' }}>

            {/* 头像 */}
            {
                message.botRole === 'user' ? (
                    <Dropdown menu={{ items: avatarElement }} trigger={['click']}>
                        <UserAvatar className={classnames(styles.avatar)} onClick={(e) => e.preventDefault()}></UserAvatar>
                    </Dropdown>
                ) : (message.botRole === 'assistant' ? (
                    <Dropdown menu={{ items: avatarElement }} trigger={['click']}>
                        <AssistantAvatar className={classnames(styles.avatar, styles.assistant_avatar)} onClick={(e) => e.preventDefault()}
                            modelId={message.modelId}></AssistantAvatar>
                    </Dropdown>

                ) : (
                    <Dropdown menu={{ items: avatarElement }} trigger={['click']}>
                        <SystemAvatar className={classnames(styles.avatar, styles.system_avatar)} onClick={(e) => e.preventDefault()}
                            purposeId={message.purposeId}></SystemAvatar>
                    </Dropdown>
                ))
            }

            <div className={classnames(styles.message)} onDoubleClick={() => {
                editable && setIsEditing(!isEditing);
            }}>
                {
                    isEditing ? (
                        <UnionEditorBlock key={0} data={{ type: "text", content: collapsedText }}
                            onEditCompleted={async (text: string) => {
                                console.log(text, '=====');
                                if (text !== message.text && text?.trim()) {
                                    //保存编辑后的文本
                                    let res = await updateMessageTextById(message.id, text);
                                    //
                                    onMessageChange && onMessageChange();
                                }
                                setIsEditing(false);
                            }}></UnionEditorBlock>
                    ) : (
                        parseBlocks(fromSystem, collapsedText).map((block, index) =>
                            <UnionBlock key={index} data={block}></UnionBlock>
                        )
                    )
                }
            </div>
        </div>
    );
};



/**
 * FIXME: expensive function, especially as it's not been used in incremental fashion
 */
export const parseBlocks = (forceText: boolean, text: string): BlockData[] => {
    if (forceText)
        return [{ type: 'text', content: text }];

    const codeBlockRegex = /`{3,}([\w\\.+]+)?\n([\s\S]*?)(`{3,}|$)/g;
    const result: BlockData[] = [];

    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
        const markdownLanguage = (match[1] || '').trim();
        const code = match[2].trim();
        const blockEnd: string = match[3];

        // Load the specified language if it's not loaded yet
        // NOTE: this is commented out because it inflates the size of the bundle by 200k
        // if (!Prism.languages[language]) {
        //   try {
        //     require(`prismjs/components/prism-${language}`);
        //   } catch (e) {
        //     console.warn(`Prism language '${language}' not found, falling back to 'typescript'`);
        //   }
        // }

        const codeLanguage = inferCodeLanguage(markdownLanguage, code);
        const highlightLanguage = codeLanguage || 'typescript';
        const highlightedCode = Prism.highlight(
            code,
            Prism.languages[highlightLanguage] || Prism.languages.typescript,
            highlightLanguage,
        );

        result.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        result.push({ type: 'code', content: highlightedCode, language: codeLanguage, complete: blockEnd.startsWith('```'), code });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
        result.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return result;
};




export const inferCodeLanguage = (markdownLanguage: string, code: string): string | null => {
    // we have an hint
    if (markdownLanguage) {
        // no dot: assume is the syntax-highlight name
        if (!markdownLanguage.includes('.'))
            return markdownLanguage;

        // dot: there's probably a file extension
        const extension = markdownLanguage.split('.').pop();
        if (extension) {
            const languageMap: { [key: string]: string } = {
                cs: 'csharp', html: 'html', java: 'java', js: 'javascript', json: 'json', jsx: 'javascript',
                md: 'markdown', py: 'python', sh: 'bash', ts: 'typescript', tsx: 'typescript', xml: 'xml',
            };
            const language = languageMap[extension];
            if (language)
                return language;
        }
    }

    // based on how the code starts, return the language
    if (code.startsWith('<DOCTYPE html') || code.startsWith('<!DOCTYPE')) return 'html';
    if (code.startsWith('<')) return 'xml';
    if (code.startsWith('from ')) return 'python';
    if (code.startsWith('import ') || code.startsWith('export ')) return 'typescript'; // or python
    if (code.startsWith('interface ') || code.startsWith('function ')) return 'typescript'; // ambiguous
    if (code.startsWith('package ')) return 'java';
    if (code.startsWith('using ')) return 'csharp';
    return null;
};



const getAvatarMenu = (role: 'user' | 'assistant' | 'system', isMe: boolean, editable: boolean,
    onCopy: (e: any) => void, onEdit: (e: any) => void,
    onRunAgain: (e: any) => void, onDelete: (e: any) => void): MenuProps['items'] => {

    if (role === 'system') {
        return [
            {
                key: '1',
                label: (
                    <div className={styles.avatar_menu_item}>
                        复制
                    </div>
                ),
                icon: <CopyOutlined style={{ fontSize: '20px' }} />,
                onClick: onCopy
            }
        ] as MenuProps['items'];
    }

    const avatarMenu: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <div className={styles.avatar_menu_item}>
                    复制
                </div>
            ),
            icon: <CopyOutlined style={{ fontSize: '20px' }} />,
            onClick: onCopy
        },
        {
            key: '2',
            label: (
                <div className={styles.avatar_menu_item}>
                    编辑
                </div>
            ),
            disabled: !editable,
            icon: <EditOutlined style={{ fontSize: '20px' }} />,
            onClick: onEdit
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: (
                <div className={styles.avatar_menu_item}>
                    再次运行
                </div>
            ),
            disabled: role !== 'user',
            icon: <PlaySquareOutlined style={{ fontSize: '20px' }} />,
            onClick: onRunAgain
        },
        {
            key: '4',
            danger: true,
            label: (
                <div className={styles.avatar_menu_item}>
                    删除
                </div>
            ),
            icon: <DeleteOutlined style={{ fontSize: '20px' }} />,
            onClick: onDelete
        },
    ];

    return avatarMenu;
}




export default Message;