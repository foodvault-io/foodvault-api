export type FacebookUser = {
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