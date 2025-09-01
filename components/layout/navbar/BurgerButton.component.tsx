
import { borderRadius } from '@/lib/styles/borderRadius';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/icons-material/Menu';
import { ButtonProps, IconButton } from "@mui/material";

type Props = {
    isDrawerOpen: boolean,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
} & ButtonProps

const BurgerButton = ({ isDrawerOpen, setIsDrawerOpen, ...otherProps }: Props) => {


    return (
        <IconButton
            {...otherProps}
            sx={{
                alignItems: 'center',
                borderRadius: borderRadius.circle,
                ...otherProps.sx
            }}

            onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <CloseIcon sx={{ color: 'neutral.main' }}
            /> : <Menu sx={{ color: 'neutral.main' }} />}
        </IconButton >
    )
}

export default BurgerButton