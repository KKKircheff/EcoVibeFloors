import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode
    borderColor?: 'light' | 'lighter'
}

const PrimaryActionButton = ({ children, borderColor = 'lighter', ...otherProps }: HeroButtonProps) => {
    // const borderColorValue = borderColor === 'light' ? palette.info[200] : palette.info[100]
    const borderColorValue = palette.primary[500]

    return (
        <Button
            variant='contained'
            color='primary'
            size="large"
            {...otherProps}
            sx={{
                px: 4,
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: palette.primary[50],
                border: `2px solid ${borderColorValue}`,
                '&:hover': {
                    border: `2px solid ${palette.primary[700]}`,
                },
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export default PrimaryActionButton