import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto, LocalSignInDto } from './dto';
import { Login, SignUp } from './entities';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Tokens } from './types';
import { RtJwtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { Logger } from '@nestjs/common';


@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    log = new Logger('AuthController');

    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({ summary: 'Create User Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'New User Created',
        type: SignUp,
    })
    @Public()
    @Post('/local/signup')
    async signUpLocally(@Body() signUpDto: LocalAuthDto): Promise<Tokens> {
        return await this.authService.signUpLocally(signUpDto);
    }

    @ApiOperation({ summary: 'Sign In Using the Local Strategy' })
    @ApiResponse({
        status: 201,
        description: 'User Signed In',
        type: Login,
    })
    @Public()
    @Post('/local/login')
    signInLocally(@Body() loginDto: LocalSignInDto) {
        return this.authService.signInLocally(loginDto);
    }


    @Post('logout')
    logout(@GetCurrentUserId() userId: string) {
        return this.authService.localLogout(userId);
    }

    @Public()
    @UseGuards(RtJwtGuard)
    @Post('/refresh')
    refreshToken(
        @GetCurrentUserId() userId: string, 
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        return this.authService.refreshToken(userId, refreshToken)
    }
}
