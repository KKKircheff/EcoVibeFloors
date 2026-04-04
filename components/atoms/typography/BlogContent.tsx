import { Typography, TypographyProps } from '@mui/material';

interface BlogContentProps extends TypographyProps {
    children: React.ReactNode;
}

export function BlogContent({ children, ...props }: BlogContentProps) {
    return (
        <Typography
            variant="subtitle2"
            {...props}
        >
            {children}
        </Typography>
    );
}
