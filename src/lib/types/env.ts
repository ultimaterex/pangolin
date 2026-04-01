export type Env = {
    app: {
        environment: string;
        sandbox_mode: boolean;
        version: string;
        dashboardUrl: string;
        notifications: {
            product_updates: boolean;
            new_releases: boolean;
        };
        identityProviderMode?: "global" | "org";
    };
    server: {
        externalPort: string;
        nextPort: string;
        sessionCookieName: string;
        resourceAccessTokenParam: string;
        resourceSessionRequestParam: string;
        resourceAccessTokenHeadersId: string;
        resourceAccessTokenHeadersToken: string;
        reoClientId?: string;
        maxmind_db_path?: string;
        maxmind_asn_path?: string;
    };
    email: {
        emailEnabled: boolean;
    };
    flags: {
        disableSignupWithoutInvite: boolean;
        disableUserCreateOrg: boolean;
        emailVerificationRequired: boolean;
        allowRawResources: boolean;
        disableLocalSites: boolean;
        disableBasicWireguardSites: boolean;
        hideSupporterKey: boolean;
        usePangolinDns: boolean;
        disableProductHelpBanners: boolean;
        disableEnterpriseFeatures: boolean;
    };
    branding: {
        appName?: string;
        background_image_path?: string;
        hideAuthLayoutFooter?: boolean;
        logo?: {
            lightPath?: string;
            darkPath?: string;
            authPage?: {
                width?: number;
                height?: number;
            };
            navbar?: {
                width?: number;
                height?: number;
            };
        };
        loginPage: {
            subtitleText?: string;
        };
        signupPage: {
            subtitleText?: string;
        };
        resourceAuthPage: {
            showLogo?: boolean;
            titleText?: string;
            subtitleText?: string;
        };
        footer?: string;
        /** Auth layout footer (copyright, edition, product link) */
        authFooter?: {
            /** Replaces default “Fossorial, Inc.” in © line */
            publisher?: string;
            /** Base URL for footer links (default: pangolin.net) */
            siteUrl?: string;
            /** Replaces Community / Enterprise / Cloud edition label; empty string hides it */
            editionLabel?: string;
            hidePublisher?: boolean;
            hideEdition?: boolean;
        };
    };
};
