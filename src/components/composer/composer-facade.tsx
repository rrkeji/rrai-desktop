
import React, { useState } from 'react';
import classnames from 'classnames';
import { Input } from 'antd';
const { TextArea } = Input;

import styles from './composer-facade.less';

export interface ComposerFacadeProps {
    className?: string;
    height?: number;
    disableSend?: boolean;
    conversationType?: string;
    conversationId: string;
    sendMessage?: (userText: string, conversationId: string) => Promise<any>;
    stopGeneration?: () => void;
}

export const ComposerFacade: React.FC<ComposerFacadeProps> = ({ className, height, disableSend, conversationId, conversationType, sendMessage, stopGeneration }) => {

    const [message, setMessage] = useState<string>('');

    //
    return (
        <div className={classnames(styles.container, className)} style={{ height: height }}>
            <div className={classnames(styles.toolbar)}></div>
            <div className={classnames(styles.input_container)} >
                <TextArea className={classnames(styles.input)} rows={4} value={message}
                    onChange={(event: any) => {
                        setMessage(event.target.value);
                    }} placeholder="输入" maxLength={4000} />
                {
                    disableSend ? (
                        <div className={classnames(styles.send, "iconfont icon-guanbi")} onClick={() => {
                            //handleStopClicked
                        }}></div>
                    ) : (
                        <div className={classnames(styles.send, "iconfont icon-send")} onClick={() => {
                            //handleSendClicked
                            sendMessage && sendMessage(message, conversationId);
                        }}></div>
                    )
                }

            </div>
        </div>
    );
};

export default ComposerFacade;