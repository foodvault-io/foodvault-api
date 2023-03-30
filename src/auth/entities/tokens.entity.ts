export class Tokens {
    /**
     * The accessToken 
     * @example '1234567890'
     * @type string
     * @comment 'Hold user ID, email, and role. Expires in 15 minutes.  Used as Global Guard for all routes unless @Public() decorator is used.'
     */
    accessToken: string;

    /**
     * The refreshToken
     * @example '1234567890'
     * @comment 'Hold user ID, email, and role. Expires in 7 days.  Used to refresh access token.'
     * @type string
     */
    refreshToken: string;
}

export class Token {
    /**
     * The accessToken 
     * @example '1234567890'
     * @type string
     * @comment 'Hold user ID, email, and role. Expires in 15 minutes.  Used as Global Guard for all routes unless @Public() decorator is used.'
     */
    accessToken: string;

}