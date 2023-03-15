import { IsInt, IsString } from '@nestjs/class-validator';

export class CreateExampleDto {
    @IsString()
    readonly name: string;

    @IsInt()
    readonly age: number;

    @IsString()
    readonly breed: string;
}
