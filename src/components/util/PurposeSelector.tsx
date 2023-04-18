import * as React from 'react';

import { AspectRatio, Box, Button, Grid, Stack, Textarea, Typography, useTheme } from '@mui/joy';

import { SystemPurposeId, SystemPurposes } from '@/databases/data/index';


export interface PurposeSelectorProps {
  systemPurposeId: SystemPurposeId;
  handlePurposeChange: (purpose: SystemPurposeId | null) => void;
  handleCustomSystemMessageChange: (v: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const PurposeSelector: React.FC<PurposeSelectorProps> = ({ systemPurposeId, handlePurposeChange, handleCustomSystemMessageChange }) => {
  // external state
  const theme = useTheme();

  return (
    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center', mx: 2, minHeight: '450px' }}>
      <Box>
        <Typography level='body3' color='neutral' sx={{ mb: 2 }}>
          AI目标
        </Typography>
        <Grid container spacing={1}>
          {Object.keys(SystemPurposes).map(spId => (
            <Grid key={spId} xs={4} lg={3} xl={2}>
              <AspectRatio variant='plain' ratio={1} sx={{
                minWidth: { xs: 56, lg: 78, xl: 130 }, maxWidth: 130,
                ...(systemPurposeId !== spId ? {
                  borderRadius: 8,
                  boxShadow: theme.vars.shadow.md,
                } : {}),
              }}>
                <Button
                  variant={systemPurposeId === spId ? 'solid' : 'soft'}
                  color={systemPurposeId === spId ? 'primary' : 'neutral'}
                  onClick={() => handlePurposeChange(spId as SystemPurposeId)}
                  sx={{
                    flexDirection: 'column',
                    gap: { xs: 2, lg: 3 },
                    ...(systemPurposeId !== spId ? {
                      background: theme.vars.palette.background.level1,
                    } : {}),
                    // fontFamily: theme.vars.fontFamily.code,
                    fontWeight: 500,
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>
                    {SystemPurposes[spId as SystemPurposeId]?.symbol}
                  </div>
                  <div>
                    {SystemPurposes[spId as SystemPurposeId]?.title}
                  </div>
                </Button>
              </AspectRatio>
            </Grid>
          ))}
        </Grid>
        <Typography level='body2' sx={{ mt: 2 }}>
          {SystemPurposes[systemPurposeId].description}
        </Typography>
        {systemPurposeId === 'Custom' && (
          <>
            <Textarea variant='soft' autoFocus placeholder={'输入您的自定义消息'}
              minRows={3}
              defaultValue={SystemPurposes['Custom'].systemMessage} onChange={handleCustomSystemMessageChange}
              sx={{
                mt: 1,
                fontSize: '16px',
                lineHeight: 1.75,
              }} />
          </>
        )}
      </Box>
    </Stack>
  );
}