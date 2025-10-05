import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode
    borderColor?: 'light' | 'lighter'
}

const PrimaryActionButton = ({ children, borderColor = 'lighter', variant = 'contained', ...otherProps }: HeroButtonProps) => {

    const isOutlined = variant === 'outlined'
    const borderColorValue = palette.primary[500]

    return (
        <Button
            variant={variant}
            color='primary'
            size="large"
            {...otherProps}
            sx={{
                px: 4,
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: isOutlined ? palette.primary[500] : palette.primary[50],
                border: `2px solid ${borderColorValue}`,
                '&:hover': {
                    border: isOutlined ? `2px solid ${palette.primary[700]}` : `2px solid ${palette.primary[700]}`,
                    backgroundColor: isOutlined ? palette.primary[700] : palette.primary[700],
                    color: isOutlined ? palette.primary[50] : palette.primary[50],
                },
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export default PrimaryActionButton