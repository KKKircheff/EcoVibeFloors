import React from 'react'
import Image from 'next/image'
import { Stack } from '@mui/material'
import { borderRadius } from '@/lib/styles/borderRadius';
import { breakpoints } from '@/lib/styles/breakpoints';

type Props = {
    iconUrl: string;
    link?: string;
    newTab?: boolean;
}

const IconLink = ({
    iconUrl,
    link = 'https://easyletters.ai',
    newTab = true
}: Props) => {
    const { md: mdBreak } = breakpoints;

    const handleClick = () => {
        if (newTab) {
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = link;
        }
    };

    return (
        <Stack
            borderColor={'neutral.400'}
            overflow={'hidden'}
            onClick={handleClick}
            sx={{
                borderRadius: borderRadius.md,
                position: 'relative',
                width: "30px",
                aspectRatio: 1,
                cursor: 'pointer'
            }}
        >
            <Image
                src={iconUrl}
                fill
                sizes={`(max-width: ${mdBreak}) 100vw, 50vw`}
                alt='social media icon'
                style={{
                    borderRadius: borderRadius.md,
                    top: 'center',
                    objectFit: "cover",
                }}
            />
        </Stack>
    )
}

export default IconLink
