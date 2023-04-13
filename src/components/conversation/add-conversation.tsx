import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import styles from './add-conversation.less';
import { Input } from 'antd';

export interface AddConversationProps {
    conversationType: string,
    value?: any,
    onChange: (value: any) => void
}

export const AddConversation: React.FC<AddConversationProps> = ({ conversationType, value, onChange }) => {

    const [val, setVal] = useState<any>(null);

    const [name, setName] = useState<string>('');

    useEffect(() => {
        if (value != val) {
            setVal(value);
        }
    }, [value]);

    return (
        <div className={classnames(styles.container)}>
            
            <Input value={(val && val['name']) || ''} onChange={(event) => {
                setVal({
                    ...val,
                    "name": event.target.value
                });
            }} onBlur={() => {
                onChange(val);
            }}></Input>
        </div>
    );
};

export default AddConversation;