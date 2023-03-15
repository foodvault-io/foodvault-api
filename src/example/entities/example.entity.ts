export class Example {
    /**
     * The name of Example
     * @example 'Example'
    */
   name: string;

   /**
    * The age of Example
    * @example 1
    * @minimum 0
    * @maximum 100
    */
   age: number;

   /**
    * The breed of Example
    * @example 'Breed'
    * @maxLength 20
    * @minLength 2
    * @pattern ^[a-zA-Z0-9_]*$
    */
   breed: string;
}
