export type GoogleUser = {
    providerId: string;
    provider: string;
    firstName: string;
    lastName: string;
    email: string;
    emailValidated?: boolean;
    profileImage?: string;
    accessToken?: string;
    refreshToken?: string;
}