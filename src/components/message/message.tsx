import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { UserAvatar } from '@/components/avatars/index';
import { BlockData, _TextBlock, _CodeBlock } from '@/components/message/blocks/index';

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';

import styles from './message.less';

export interface MessageProps {
    className?: string;
    editable?: boolean;
    isEditing?: boolean;
    appending?: boolean;
    message: MessageEntity;
}

export const Message: React.FC<MessageProps> = ({ className, editable, isEditing, message, appending }) => {

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

    if (fromSystem) {
        return (
            <UnionBlock data={{ type: "text", content: collapsedText }} className={styles.system_message}></UnionBlock>
        );
    }

    if (isEditing) {
        //编辑
        return (
            <div className={classnames(styles.container)}>
                <UserAvatar className={classnames(styles.avatar)}></UserAvatar>
                <div>
                    { }
                </div>
            </div>
        );
    } else {
        //只读
        return (
            <div className={classnames(
                styles.container,
                message.botRole === 'user' ? styles.user_message : (message.botRole === 'assistant' ? styles.assistant_message : styles.system_message), className
            )}
                style={{ flexDirection: !fromAssistant ? 'row-reverse' : 'row' }}>

                <UserAvatar className={classnames(styles.avatar)}></UserAvatar>

                <div className={classnames(styles.message)}>
                    {
                        parseBlocks(fromSystem, collapsedText).map((block, index) =>
                            <UnionBlock key={index} data={block}></UnionBlock>
                        )
                    }
                </div>
            </div>
        );
    }
};

export interface UnionBlockProps {
    className?: string;
    data: BlockData;
}


export const UnionBlock: React.FC<UnionBlockProps> = ({ data, className }) => {

    if (data.type === 'code') {
        return (
            <_CodeBlock className={classnames(className, styles.code_message)}
                data={data}></_CodeBlock>
        );
    } else if (data.type === 'text') {
        return (
            <_TextBlock
                data={data}></_TextBlock>
        );
    }
    return <></>
}



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

export default Message;