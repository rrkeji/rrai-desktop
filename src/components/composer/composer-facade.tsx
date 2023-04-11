
import React from 'react';
import classnames from 'classnames';
import { Input } from 'antd';
const { TextArea } = Input;

import styles from './composer-facade.less';

export interface ComposerFacadeProps {
    className?: string;
    height?: number;
    disableSend?: boolean;
    conversationType?: string;
    sendMessage?: (userText: string, conversationId: string) => Promise<any>;
    stopGeneration?: () => void;
}

export const ComposerFacade: React.FC<ComposerFacadeProps> = ({ className, height, disableSend, conversationType, sendMessage, stopGeneration }) => {

    //
    return (
        <div className={classnames(styles.container, className)} style={{ height: height }}>
            <TextArea className={classnames(styles.input)} rows={4} placeholder="输入" maxLength={4000} />
        </div>
    );
};

export default ComposerFacade;