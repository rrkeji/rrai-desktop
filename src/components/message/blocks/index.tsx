export * from './types';
export * from './viewer/index';

import classnames from 'classnames';
import { BlockData, CodeBlockData } from './types';
import { _TextBlock, _CodeBlock } from './viewer/index';
import { _TextEditorBlock } from './editor/index';

import styles from './index.less';

export interface UnionBlockProps {
    className?: string;
    data: BlockData;
}

export const UnionBlock: React.FC<UnionBlockProps> = ({ data, className }) => {

    if (data.type === 'code') {
        return (
            <_CodeBlock className={classnames(className, styles.code_message)}
                data={data} ></_CodeBlock>
        );
    } else if (data.type === 'text') {
        return (
            <_TextBlock className={classnames(className)}
                data={data} ></_TextBlock>
        );
    }
    return <></>
}

export interface UnionEditorBlockProps {
    className?: string;
    data: BlockData;
    onEditCompleted: (text: string) => Promise<any>;
}

export const UnionEditorBlock: React.FC<UnionEditorBlockProps> = ({ data, onEditCompleted, className }) => {

    return (
        <_TextEditorBlock className={classnames(className)}
            data={data} onEditCompleted={onEditCompleted}></_TextEditorBlock>
    );
}
