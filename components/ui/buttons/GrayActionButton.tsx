import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode
    borderColor?: 'light' | 'lighter'
}

const GrayActionButton = ({ children, borderColor = 'lighter', ...otherProps }: HeroButtonProps) => {
    const borderColorValue = borderColor === 'light' ? palette.info[200] : palette.info[100]

    return (
        <Button
            variant='text'
            size="large"
            {...otherProps}
            sx={{
                border: `2px solid ${borderColorValue}`,
                px: 4,
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: palette.info[50],
                minWidth: { xs: '250px', md: 300, lg: 400 },
                '&:hover': {
                    bgcolor: 'primary.700',
                },
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export default GrayActionButton