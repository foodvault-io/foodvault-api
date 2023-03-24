export class SignUp {
    /**
     * The email of SignUp
     * @example 'example@email.com'
     * @isEmail
     * @isNotEmpty
     * @pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$
     * @type string
     * @unique
     */
    email: string;

    /**
     * The password of SignUp
     * @example 'example_password'
     * @isNotEmpty
     * @type string
     */
    password: string;

    /**
     * The name of SignUp
     * @example 'Example'
     * @type string
     * @isNotEmpty
     */
    firstName: string;

    /**
     * The surname of SignUp
     * @example 'Example'
     * @type string
     * @isNotEmpty
     */
    lastName: string;
}