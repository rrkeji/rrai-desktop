import React, { ReactNode } from 'react';
import classnames from 'classnames';
import { MessageEntity } from '@/databases/conversation/index';
import { BlockEditorProps } from '../types';
import { Textarea } from '@mui/joy';

import styles from './_text-editor-block.less';

export const _TextEditorBlock: React.FC<BlockEditorProps> = ({ className, data, sx, onEditCompleted }) => {

    const [editedText, setEditedText] = React.useState(data.content);

    const handleEditTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        setEditedText(e.target.value);

    const handleEditKeyPressed = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            onEditCompleted(editedText);
        }
    };

    const handleEditBlur = () => {
        onEditCompleted(editedText);
    };

    return (
        <Textarea
            className={classnames(styles.container, className)}
            variant='soft' color='warning' autoFocus minRows={1}
            value={editedText} onChange={handleEditTextChanged} onKeyDown={handleEditKeyPressed} onBlur={handleEditBlur}
            sx={{ flexGrow: 1 }} />
    );
};

export default _TextEditorBlock;