import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto';
import { Login, SignUp } from './entities';
import { LocalAuthGuard } from './guards';
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
    ) { }

    @ApiOperation({ summary: 'Create User Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'New User Created',
        type: SignUp,
    })
    @Post('/local/signup')
    async signUpLocally(@Body() signUpDto: LocalAuthDto) {
        return await this.authService.signUpLocally(signUpDto);
    }

    @ApiOperation({ summary: 'Sign In Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'User Signed In',
        type: Login,
    })
    @UseGuards(LocalAuthGuard)
    @Post('/local/login')
    async signInLocally(@Request() req) {
        return req.user;
    }
}
