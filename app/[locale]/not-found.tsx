'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {Box, Typography, Button, Container} from '@mui/material';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
        gap={3}
      >
        <Typography variant="h1" component="h1" color="primary">
          404
        </Typography>
        <Typography variant="h4" component="h2">
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth={600}>
          {t('description')}
        </Typography>
        <Button 
          component={Link} 
          href="/" 
          variant="contained" 
          color="primary"
          size="large"
        >
          {t('backHome')}
        </Button>
      </Box>
    </Container>
  );
}