import React, { useState } from 'react';
import classnames from 'classnames';
import { PromptsImageGrid } from '@/components/prompts/index';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

import styles from './index.less';

export interface PromptsPageProps {

}

export const PromptsPage: React.FC<PromptsPageProps> = ({ }) => {

    const [active, setActive] = useState<'image' | 'chat'>('image');

    return (
        <div className={classnames(styles.container)}>
            <div data-tauri-drag-region className={classnames(styles.header)}>
                <div data-tauri-drag-region className={classnames(styles.left)}>
                    <Radio.Group
                        options={[
                            { label: 'StableDiffusion Prompts', value: 'image' },
                            { label: 'ChatGPT Prompts', value: 'chat' },
                        ]}
                        onChange={({ target: { value } }: RadioChangeEvent) => {
                            setActive(value);
                        }}
                        value={active}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </div>
                <div data-tauri-drag-region className={classnames(styles.right)}>

                </div>
            </div>
            {
                active === 'image' && (
                    <PromptsImageGrid className={classnames(styles.content)}></PromptsImageGrid>
                )
            }
            {
                active === 'chat' && (
                    <></>
                )
            }
        </div>
    );
};

export default PromptsPage;