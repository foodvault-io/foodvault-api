import { 
    Body, 
    Controller, 
    Post, 
    UseGuards, 
    Request, 
    Get 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthDto } from './dto';
import { Login, SignUp } from './entities';
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { GoogleUser, Tokens } from './types';
import { 
    RtJwtGuard, 
    LocalAuthGuard, 
    GoogleAuthGuard 
} from '../common/guards';
import { 
    GetCurrentUser, 
    GetCurrentUserId, 
    Public,
    UserFromOAuth
} from '../common/decorators';


@ApiTags('Auth')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    // Local Controllers

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
    @UseGuards(LocalAuthGuard)
    @Post('/local/login')
    signInLocally(@Request() req) {
        return req.user;
    }

    // Google Controllers
    @ApiOperation({ summary: 'Sign In Using the Google Strategy' })
    @ApiResponse({
        status: 200,
        description: 'User Signed In',
    })
    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google')
    async googleAuth() {
        console.log('Google Auth Route Initiated')
    }

    @ApiOperation({ summary: 'Google Strategy Callback Route' })
    @ApiResponse({
        status: 200,
        description: 'User Signed In',
    })
    @Public()
    @UseGuards(GoogleAuthGuard)
    @Get('/google/callback')
    async googleAuthCallback(
        @UserFromOAuth() user: GoogleUser,
    ) { 
        return await this.authService.googleLogin(user);
    }


    // Logout and Refresh Global Controllers

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
