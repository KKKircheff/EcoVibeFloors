import { Typography, TypographyProps } from '@mui/material';

interface BlogCardExcerptProps extends TypographyProps {
    children: React.ReactNode;
}

export function BlogCardExcerpt({ children, ...props }: BlogCardExcerptProps) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.6,
            }}
            {...props}
        >
            {children}
        </Typography>
    );
}
