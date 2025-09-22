import { ImageTextGrid } from '@/components/ui/grid/ImageTextGrid'
import { Stack } from '@mui/material'
import React from 'react'

const HomecardsSection = () => {
    return (
        <Stack>
            <ImageTextGrid
                text="Discover the exceptional beauty of premium Dutch flooring solutions. Our natural oak parquet and innovative hybrid wood floors bring timeless elegance and modern durability to your Bulgarian home. Experience the perfect blend of traditional craftsmanship and contemporary design."
                images={['hw-2.jpg', 'hw-1.jpg', 'hw-3.jpg']}
                mirror={true}
            />
        </Stack>
    )
}

export default HomecardsSection