import { Chip, ChipProps } from '@mui/material';

interface BlogTagProps extends Omit<ChipProps, 'label'> {
    tag: string;
}

export function BlogTag({ tag, ...props }: BlogTagProps) {
    return (
        <Chip
            label={tag}
            size="small"
            color='primary'
            variant='filled'
            sx={{ px: 1.5, py: 2 }}
            {...props}
        />
    );
}
