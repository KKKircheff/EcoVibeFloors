'use client'
import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode
    borderColor?: 'light' | 'lighter'
}

const GrayActionButton = ({ children, borderColor = 'lighter', ...otherProps }: HeroButtonProps) => {
    // const borderColorValue = borderColor === 'light' ? palette.info[200] : palette.info[100]
    const borderColorValue = palette.info[400]
    return (
        <Button
            variant='contained'
            color='info'
            size="large"
            {...otherProps}
            sx={{
                px: 4,
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: "#FFF",
                bgcolor: palette.info[400],
                border: `2px solid ${borderColorValue}`,
                '&:hover': {
                    bgcolor: palette.info[600],
                    border: `2px solid ${palette.info[600]}`,
                },
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export default GrayActionButton