import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthDto, LocalSignInDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async signUpLocally(localAuthDto: LocalAuthDto) {
        // Hash password
        const salt = await bcryptjs.genSalt(10);
        
        if (!salt) {
            throw new Error('Error generating salt');
        }

        const hashedPassword = await bcryptjs.hash(localAuthDto.password, salt); 

        if (!hashedPassword) {
            throw new Error('Error hashing password');
        }

        // Create User
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: localAuthDto.email,
                    firstName: localAuthDto.firstName,
                    lastName: localAuthDto.lastName,
                    hashedPassword: hashedPassword,
                },
            });

            return JSON.stringify({
                user: user, //TODO:  Remove this from here. It's not secure to return the user object. We can store that in the JWT payload.
            });
        } catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code === 'P2002') {
                    throw new BadRequestException('Email already exists');
                }
            }
            throw err;
        }
    }

    async signInLocally(localSignInDto: LocalSignInDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: {
                email: localSignInDto.email,
            },
        });

        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        // Compare password
        const isMatch = await bcryptjs.compare(localSignInDto.password, user.hashedPassword);

        if (!isMatch) {
            throw new ForbiddenException('Invalid credentials');
        }

        return {
            user: user, //TODO: Remove this from here. It's not secure to return the user object. We can store that in the JWT payload.
            token: await this.signToken(
                user.id,
                user.email,
                user.role,
            ),
        };
    }

    async signToken(userId: string, email: string, role: string): Promise<{ access_token: string; }> {
        // Create JWT
        const payload = {
            sub: userId,
            email: email,
            role: role,
        };

        const secret = this.config.get('JWT_SECRET_KEY');
        const expirationTime = this.config.get('JWT_EXPIRATION_TIME');

        const jwtToken = await this.jwtService.signAsync(payload, {
            secret: secret,
            expiresIn: expirationTime,
        });

        return {
            access_token: jwtToken,
        }
    }
    
}
