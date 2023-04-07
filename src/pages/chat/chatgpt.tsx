import React from 'react';
import classnames from 'classnames';

import { Container, useTheme } from '@mui/joy';
import { CssVarsProvider } from '@mui/joy/styles';

import { Chat } from './chat';
import { isValidOpenAIApiKey, SettingsModal } from '@/components/dialogs/SettingsModal';
import { useSettingsStore } from '@/lib/store-settings';

import styles from './chatgpt.less';

export interface ChatGPTPageProps {

}

export const ChatGPTPage: React.FC<ChatGPTPageProps> = ({ }) => {
    // state
    const [settingsShown, setSettingsShown] = React.useState(false);

    // external state
    const theme = useTheme();
    const centerMode = useSettingsStore(state => state.centerMode);

    return (
        <div className={styles.container}>
            <CssVarsProvider theme={theme}>
                <Container maxWidth={false} disableGutters sx={{
                    boxShadow: 'none'
                }}>
                    <Chat onShowSettings={() => setSettingsShown(true)} />
                    <SettingsModal open={settingsShown} onClose={() => setSettingsShown(false)} />
                </Container>
            </CssVarsProvider>
        </div >
    );
};

export default ChatGPTPage;