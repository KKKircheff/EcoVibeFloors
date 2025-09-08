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
            title: 'templates' as FooterLinkKeys,
            link: '/templates',
        },
        {
            title: 'resume_ai_writer' as FooterLinkKeys,
            link: '/ai-writer',
        },
        {
            title: 'docExtractor' as FooterLinkKeys,
            link: '/profile',
        },
        {
            title: 'create_new_profile' as FooterLinkKeys,
            link: '/sign-up',
        },
    ],
    shortcuts: [
        {
            title: 'log_in' as FooterLinkKeys,
            link: '/login',
        },
        {
            title: 'sign_up' as FooterLinkKeys,
            link: '/signup',
        },
        {
            title: 'pricing' as FooterLinkKeys,
            link: '/pricing',
        },
        {
            title: 'account' as FooterLinkKeys,
            link: '/account',
        },
    ],
    support: [
        {
            title: 'support_email' as FooterLinkKeys,
            link: '',
        },
        {
            title: 'trademark' as FooterLinkKeys,
            link: '/gdpr',
        },
        {
            title: 'kvk' as FooterLinkKeys,
            link: '/gdpr',
        },
        {
            title: 'address' as FooterLinkKeys,
            link: '/gdpr',
        },
    ],
};
