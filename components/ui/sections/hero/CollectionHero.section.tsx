import { Stack, StackProps, Typography } from '@mui/material';
import { LearnMoreLink } from '@/components/ui/links/LearnMoreLink.component';

interface CollectionHeroProps extends Omit<StackProps, 'children'> {
    title: string;
    subtitle?: string;
    learnMoreText?: string;
    learnMoreTargetId?: string;
}

export function CollectionHero({
    title,
    subtitle,
    learnMoreText,
    learnMoreTargetId,
    spacing = 3,
    alignItems = "center",
    textAlign = "center",
    ...stackProps
}: CollectionHeroProps) {
    return (
        <Stack spacing={spacing} alignItems={alignItems} textAlign={textAlign} {...stackProps}>
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
