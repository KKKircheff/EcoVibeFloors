import { Typography, TypographyProps } from '@mui/material';

interface BlogSubtitleProps extends TypographyProps {
    children: React.ReactNode;
}

export function BlogSubtitle({ children, ...props }: BlogSubtitleProps) {
    return (
        <Typography
            variant="h5"
            color="primary.500"
            fontWeight={500}
            {...props}
        >
            {children}
        </Typography>
    );
}
