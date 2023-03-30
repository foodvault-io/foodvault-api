export type OAuthUser = {
    providerId: string;
    provider: string;
    firstName: string;
    lastName: string;
    email: string;
    emailValidated?: boolean;
    photo?: string;
    accessToken?: string;
    refreshToken?: string;
}