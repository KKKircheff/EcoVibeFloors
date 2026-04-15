import 'server-only';
import { Stack, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';
import type { BlogCategory } from '@/lib/types/blog';

interface BlogIntroSectionProps {
    category: BlogCategory;
    date: string;
    readingTime: number;
    introParagraphs: string[];
}

export function BlogIntroSection({ category, date, readingTime, introParagraphs }: BlogIntroSectionProps) {
    return (
        <Stack spacing={{ xs: 3, md: 4 }} py={{ xs: 4, md: 10 }} maxWidth={'xl'}>
            {/* Meta strip */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={3}
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 3,
                }}
            >
                <BlogCategoryBadge category={category} />

                <Stack direction="row" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: 'info.400' }} />
                        <Typography variant="body2" color="info.400">
                            {date}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'info.400' }} />
                        <Typography variant="body2" color="info.400">
                            {readingTime} min
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>

            {/* Intro paragraphs — larger, more prominent typography */}
            {introParagraphs.map((text, i) => (
                <Typography
                    key={i}
                    variant='body1'
                // color="info.300"
                // lineHeight={1}
                >
                    {text}
                </Typography>
            ))}

            <Stack
                direction="row"
                alignItems="center"
                sx={{
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            ></Stack>
        </Stack>
    );
}