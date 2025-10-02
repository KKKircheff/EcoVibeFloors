'use client';

import {useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/navigation';
import {Box, Typography, Container} from '@mui/material';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';

export default function NotFound() {
  const t = useTranslations('notFound');
  const tButtons = useTranslations('buttons');
  const router = useRouter();

  const handleBackHome = () => {
    router.push('/');
  };

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
        <PrimaryActionButton
          onClick={handleBackHome}
          variant="contained"
          color="primary"
          size="large"
        >
          {tButtons('backHome')}
        </PrimaryActionButton>
      </Box>
    </Container>
  );
}