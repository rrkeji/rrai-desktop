import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';


import { CodeBlock, inferCodeLanguage } from './code-block';

//
export type Block = TextBlock | CodeBlock;

export type TextBlock = { type: 'text'; content: string; };


/**
 * FIXME: expensive function, especially as it's not been used in incremental fashion
 */
export const parseBlocks = (forceText: boolean, text: string): Block[] => {
    if (forceText)
        return [{ type: 'text', content: text }];

    const codeBlockRegex = /`{3,}([\w\\.+]+)?\n([\s\S]*?)(`{3,}|$)/g;
    const result: Block[] = [];

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