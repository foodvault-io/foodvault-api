import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto, LocalSignInDto } from './dto';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/local/sign-up')
    @ApiOperation({ summary: 'Create User Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'New User Created',
        type: LocalAuthDto,
    })
    async createUserLocally(@Body() body: LocalAuthDto) {
        return await this.authService.signUpLocally(body);
    }

    @Post('/local/sign-in')
    @ApiOperation({ summary: 'Sign In Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'User Signed In',
        type: LocalAuthDto,
    })
    async signInLocally(@Body() body: LocalSignInDto) {
        return await this.authService.signInLocally(body);
    }
}
