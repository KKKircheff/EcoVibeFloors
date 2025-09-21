
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { borderRadius } from '@/lib/styles/borderRadius';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import { ButtonProps, IconButton } from "@mui/material";

type Props = {
    isDrawerOpen: boolean,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
} & ButtonProps

const BurgerButton = ({ isDrawerOpen, setIsDrawerOpen, ...otherProps }: Props) => {
    // const isScrolled = useScrollPosition(30);
    const isScrolled = true

    return (
        <IconButton
            size='small'
            {...otherProps}
            sx={{
                alignItems: 'center',
                borderRadius: borderRadius.circle,
                ...otherProps.sx
            }}

            onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <CloseIcon sx={{ color: 'info.300' }}
            /> : <Menu sx={{ color: isScrolled ? 'info.300' : 'info.50' }} />}
        </IconButton >
    )
}

export default BurgerButton