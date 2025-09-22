import { Typography, TypographyProps } from '@mui/material';
import React from 'react'

type Props = {
    quote: string;
    size?: 'full' | "half" | "2/3"
} & TypographyProps

const Quote = ({ quote, size = 'full', ...otherProps }: Props) => {
    return (
        <Typography
            variant='h2'
            textAlign={size === 'full' ? 'left' : 'right'}
            width={size === 'full' ? '100%' : size === 'half' ? '50%' : '66.6%'}
            fontFamily={'Montserrat'}
            fontWeight={400}
            {...otherProps}

            sx={
                { ...otherProps.sx }
            }
        >
            {quote.toUpperCase()}
        </Typography>
    )
}

export default Quote