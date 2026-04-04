import { alpha } from '@mui/material';
import {palette} from './pallete';

// export const menuBgColor = 'rgba(255, 255, 255, 0.95)'; // Semi-transparent white for glass effect
// export const menuBgColor = 'rgba(255, 255, 255, 1)';
export const menuBgColor = 'rgba(250, 250, 250, 1)';
// export const menuBgColor = '#FFF';

// Semi-transparent backdrop used for hero text blocks and hero buttons
export const heroTextsbackground = alpha(palette.primary[700], 0.8);

export const colors = {
    menuBackground: menuBgColor,
    glassMorphism: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    ...palette,
};
