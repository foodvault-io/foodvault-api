export class Login {
    /**
     * The email of Login
     * @example 'example_email@gmail.com'
     * @isEmail
     * @isNotEmpty
     * @pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
     * @type string
     * @unique
     */
    email: string;

    /**
     * The password of Login
     * @example 'example_password'
     * @isNotEmpty
     * @type string
     */
    password: string;
}