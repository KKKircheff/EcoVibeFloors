import { Typography, TypographyProps } from '@mui/material';

interface BlogCardTitleProps extends TypographyProps {
    children: React.ReactNode;
}

export function BlogCardTitle({ children, ...props }: BlogCardTitleProps) {
    return (
        <Typography
            variant="h3"
            component="h3"
            sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontWeight: 500,
            }}
            {...props}
        >
            {children}
        </Typography>
    );
}
