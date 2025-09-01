// 'use client';
// import React from 'react';
// import {
//     MenuItem,
//     Typography,
//     Stack,
//     Divider,
//     StackProps,
// } from '@mui/material';
// import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
// import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
// import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
// import { borderRadius } from '@/lib/styling/borderRadius';
// import { palette } from '@/lib/styling/palette';
// import { UserProfile } from '@/lib/profile/userProfileTypes';
// import { signOut } from '@/features/auth/actions/signOut';
// import { LoginMenuButton } from '../ui-components/buttons/LoginMenuButton.component';
// import { useRouter } from '@/utils/next-intl/routing';
// import { useTranslations } from 'next-intl';

// type Props = {
//     user: UserProfile | null;
//     isOpen: boolean;
//     setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     startTransition: React.TransitionStartFunction;
//     handleDrawerClose: () => void;
// } & StackProps;

// const UserMenu = ({ user, isOpen, setIsOpen, startTransition, handleDrawerClose, ...otherProps }: Props) => {
//     const router = useRouter();
//     const t = useTranslations('NavbarDropDownMenu');

//     const handleLogout = () => {
//         setIsOpen(false);
//         handleDrawerClose?.();
//         startTransition(async () => {
//             try {
//                 await signOut();
//             } catch (error) {
//                 console.log(error);
//             }
//         });
//     };

//     const handleNavigation = (path: string) => {
//         setIsOpen(false);
//         handleDrawerClose?.();
//         router.push(path);
//     };

//     return (
//         <Stack
//             display={isOpen ? 'block' : 'none'}
//             position='absolute'
//             right={0}
//             top={{ xs: 'auto', md: '100%' }}
//             bottom={{ xs: '100%', md: 'auto' }}
//             bgcolor={'transparent'}
//             width={'250px'}
//             zIndex={1}
//             py={1}
//             {...otherProps}
//         >
//             <Stack
//                 direction={'column'}
//                 bgcolor={'neutral.900'}
//                 color={'neutral.50'}
//                 border={'1px solid'}
//                 borderColor={'neutral.400'}
//                 borderRadius={borderRadius.xl}
//                 py={1}
//             >
//                 <MenuItem sx={{ justifyContent: 'flex-end', cursor: 'default' }}>
//                     <Typography variant="body2">
//                         {t('hello', { name: user?.general.firstName || '' })}
//                     </Typography>
//                 </MenuItem>
//                 <Divider orientation="horizontal" sx={{ mx: 2, my: 1, borderColor: 'neutral.500' }} flexItem />
//                 <LoginMenuButton startIcon={<ControlPointDuplicateIcon style={{ color: palette.neutral[50] }} aria-label={t('addCredits')} />} onClick={() => handleNavigation(`/pricing`)}>
//                     {t('addCredits')}
//                 </LoginMenuButton>
//                 <LoginMenuButton startIcon={<PermIdentityOutlinedIcon style={{ color: palette.neutral[50] }} aria-label={t('account')} />} onClick={() => handleNavigation(`/account`)} >
//                     {t('account')}
//                 </LoginMenuButton>
//                 <LoginMenuButton startIcon={<PowerSettingsNewIcon style={{ color: palette.neutral[50] }} aria-label={t('logOut')} />} onClick={handleLogout}>
//                     {t('logOut')}
//                 </LoginMenuButton>
//             </Stack>
//         </Stack>
//     );
// };

// export default UserMenu;