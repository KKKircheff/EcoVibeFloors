import { Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface BlogMetaProps {
    date: string; // formatted date string
    readingTime: number; // minutes
    locale?: 'bg' | 'en';
}

export function BlogMeta({ date, readingTime }: BlogMetaProps) {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
                <CalendarTodayIcon sx={{ fontSize: 14, color: 'info.400' }} />
                <Typography variant="caption" color="info.400">
                    {date}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
                <AccessTimeIcon sx={{ fontSize: 14, color: 'info.400' }} />
                <Typography variant="caption" color="info.400">
                    {readingTime} min
                </Typography>
            </Stack>
        </Stack>
    );
}
