import { layoutPaddings } from "@/lib/styles/layoutPaddings"
import { Stack, StackProps } from "@mui/material"


type Props = {
    children: React.ReactNode | React.ReactNode[]
} & StackProps

const PageLayoutContainer = ({ children, ...otherProps }: Props) => {
    return (
        <Stack
            width='100%'
            px={layoutPaddings}
            mx='auto'
            {...otherProps}
            sx={{
                ...otherProps.sx
            }}
        >
            {children}
        </Stack >
    )
}

export default PageLayoutContainer;