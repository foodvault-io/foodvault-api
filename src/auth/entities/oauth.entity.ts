export class OpenAuthUser {
    /**
     * The providerId of OpenAuthUser
     * @example '1234567890'
     * @isNotEmpty
     * @type string
     * @unique
     */
    providerId: string;

    /**
     * The provider of OpenAuthUser
     * @example 'google' | 'facebook' | 'linkedIn' 
     * @isNotEmpty
     * @type string
    */
    provider: string;

    /**
     * The firstName of OpenAuthUser
     * @example 'John'
     * @isNotEmpty
     * @type string
     */
    firstName: string;

    /**
     * The lastName of OpenAuthUser
     * @example 'Doe'
     * @isNotEmpty
     * @type string
     */
    lastName: string;

    /**
     * The email of OpenAuthUser
     * @example 'example_email@gmail.com'
     * @isEmail
     * @isNotEmpty
     * @pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
     * @type string
     * @unique
     */
    email: string;

    /**
     * The emailValidated of OpenAuthUser
     * @example true | false
     * @type boolean
     * @default true
     * @optional
     * @isBoolean
     * @nullable
     */
    emailValidated?: boolean;
    
    /**
     * The photo of OpenAuthUser
     * @example 'https://example.com/photo.jpg'
     * @type string
     * @default null
     * @nullable
     * @optional
     * @isUrl
     */
    photo?: string;

    /**
     * The accessToken of OpenAuthUser
     * @example '1234567890'
     * @type string
     * @default null
     * @nullable
     */
    accessToken?: string;
}