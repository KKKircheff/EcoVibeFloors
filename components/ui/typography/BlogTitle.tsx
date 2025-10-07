import { Typography, TypographyProps } from '@mui/material';

interface BlogTitleProps extends TypographyProps {
    children: React.ReactNode;
}

export function BlogTitle({ children, ...props }: BlogTitleProps) {
    return (
        <Typography
            variant="h3"
            color="info.500"
            fontWeight={500}
            {...props}
        >
            {children}
        </Typography>
    );
}
