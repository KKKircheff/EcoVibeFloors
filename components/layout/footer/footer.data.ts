type FooterLinkKeys = Exclude<keyof IntlMessages['footer']['links'], 'label'>;

export const footerData = {
    policies: [
        {
            title: 'terms_of_service' as FooterLinkKeys,
            link: '/terms-of-service',
        },
        {
            title: 'privacy_policy' as FooterLinkKeys,
            link: '/privacy-policy',
        },
        {
            title: 'gdpr' as FooterLinkKeys,
            link: '/gdpr',
        },
        {
            title: 'accessibility' as FooterLinkKeys,
            link: '/accessibility',
        },
    ],
    resources: [
        {
            title: 'home' as FooterLinkKeys,
            link: '/',
        },
        {
            title: 'collections' as FooterLinkKeys,
            link: '/collections',
        },
        {
            title: 'contact' as FooterLinkKeys,
            link: '/contact',
        },
        {
            title: 'blog' as FooterLinkKeys,
            link: '/blog',
        },
    ],
    support: [
        {
            title: 'support_email' as FooterLinkKeys,
            link: '',
        },
        {
            title: 'phone' as FooterLinkKeys,
            link: '/',
        },
        {
            title: 'trademark' as FooterLinkKeys,
            link: '/',
        },
        {
            title: 'address' as FooterLinkKeys,
            link: '/',
        },
    ],
};
