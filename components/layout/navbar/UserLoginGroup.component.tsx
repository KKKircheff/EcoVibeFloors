// 'use client'
// import { Stack, Typography } from '@mui/material';
// import { isMobile } from 'react-device-detect';
// import React, { useState, useTransition } from 'react';
// import { LanguageSelector } from './LanguageSelector.component';
// import UserMenu from './UserMenu.component';
// import { Account, UserProfile } from '@/lib/profile/userProfileTypes';
// import { Locale, useRouter } from '@/utils/next-intl/routing';
// import useScreenWidth from '@/hooks/useScreenWidth';
// import { BsThreeDotsVertical } from 'react-icons/bs';

// type Props = {
//     user: UserProfile | null;
//     account: Account | null
//     locale: Locale;
//     handleDrawerClose?: () => void
// }

// export const UserLoginGroup = ({
//     user,
//     account,
//     locale,
//     handleDrawerClose = () => { },
// }: Props) => {

//     const screenWidth = useScreenWidth() ?? 0;
//     const [isPending, startTransition] = useTransition()
//     const [isOpen, setIsOpen] = useState(false)
//     const router = useRouter()

//     const handleLoginClick = () => {
//         if (!user) {
//             setIsOpen(false);
//             handleDrawerClose?.()
//             startTransition(() => {
//                 router.push('/login')
//             });
//             return;
//         }
//         setIsOpen(prev => !prev);
//     }

//     const handleMouseLeave = () => {
//         if (screenWidth > 900) {
//             setIsOpen(false)
//         }
//     }
//     const handleMouseEnter = () => {
//         if (screenWidth > 900) {
//             setIsOpen(true)
//         }
//     }

//     return (
//         <Stack
//             direction={'row'}
//             spacing={2}
//             sx={{ cursor: 'pointer' }}
//             alignItems={'center'}
//         >
//             <LanguageSelector locale={locale} />
//             <Stack
//                 position={'relative'}
//                 direction={{ xs: 'column-reverse', md: 'column' }}
//                 onMouseLeave={handleMouseLeave}
//                 width={'80%'}
//             >
//                 <BlackButton
//                     fullWidth
//                     onClick={handleLoginClick}
//                     onMouseEnter={isMobile ? undefined : () => setIsOpen(true)}
//                     disabled={isPending}
//                     endIcon={user ? <BsThreeDotsVertical /> : <></>}
//                     aria-label={user ? `AI Credits: ${account?.credits}` : 'LOGIN'}
//                     sx={{
//                         transform: 'scale(1)',
//                         '&:hover': {
//                             transform: { xs: 'scale(1)', md: user ? 'scale(1)' : 'scale(1.08)' }
//                         },
//                     }}
//                 >
//                     <Typography variant="body2">
//                         {user ? `AI Credits: ${account?.credits}` : 'LOGIN'}
//                     </Typography>
//                 </BlackButton>
//                 {user
//                     ? <UserMenu
//                         user={user}
//                         isOpen={isOpen}
//                         setIsOpen={setIsOpen}
//                         startTransition={startTransition}
//                         handleDrawerClose={handleDrawerClose}
//                     />
//                     : <></>}
//             </Stack>
//         </Stack>
//     );
// };