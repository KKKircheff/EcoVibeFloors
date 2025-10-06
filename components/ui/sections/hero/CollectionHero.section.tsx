import { Stack, Typography } from '@mui/material';
import { LearnMoreLink } from '@/components/ui/links/LearnMoreLink.component';

interface CollectionHeroProps {
    title: string;
    subtitle?: string;
    learnMoreText?: string;
    learnMoreTargetId?: string;
}

export function CollectionHero({
    title,
    subtitle,
    learnMoreText,
    learnMoreTargetId
}: CollectionHeroProps) {
    return (
        <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h1" fontWeight={600}>
                {title}
            </Typography>

            {subtitle && (
                <Typography variant="h5" maxWidth="800px">
                    {subtitle}
                </Typography>
            )}

            {learnMoreText && learnMoreTargetId && (
                <LearnMoreLink targetId={learnMoreTargetId}>
                    {learnMoreText}
                </LearnMoreLink>
            )}
        </Stack>
    );
}
