import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalAuthDto } from './dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { Token, Tokens, GoogleUser, FacebookUser } from './types';


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private config: ConfigService,
    ) { }

    // Local Login & SignUp Methods:
    async signUpLocally(localAuthDto: LocalAuthDto): Promise<Tokens> {
        // Hash password
        const securePassword = await argon2.hash(localAuthDto.password);

        // Create User:
        try {
            // Create User:
            const newUser = await this.createUser({
                email: localAuthDto.email,
                firstName: localAuthDto.firstName,
                lastName: localAuthDto.lastName,
                password: securePassword,
            });

            // Create Tokens:
            const tokens = await this.getTokens(
                newUser.id,
                newUser.email,
                newUser.role,
            )
            // Create Account:
            await this.prisma.account.create({
                data: {
                    userId: newUser.id,
                    providerType: 'email',
                    provider: 'local',
                    providerAccountId: newUser.email,
                    accessToken: tokens.accessToken,
                    accessTokenExpires: 60 * 15,
                    tokenType: 'Bearer',
                }
            });

            await this.updateRefreshTokenHashLocal(newUser.id, tokens.refreshToken);

            return tokens;

        } catch (err) {
            if (err.code === 'P2002') {
                throw new BadRequestException('Email already exists');
            }
            throw err;
        }
    }

    async signInLocally(email: string, password: string): Promise<Tokens | undefined> {
        const user = await this.findOneByEmail(email);

        if (!user) {
            throw new NotFoundException('User not Found');
        }

        try {
            if (await argon2.verify(user.hashedPassword, password)) {
                const tokens = await this.getTokens(user.id, user.email, user.role);
                await this.updateRefreshTokenHashLocal(user.id, tokens.refreshToken);
                return tokens;
            }
            throw new ForbiddenException('Invalid Password');
        } catch (err) {
            throw err;
        }
    }

    // TODO: Merge Google and Facebook Login Methods into OAuth Login Method:
    // Google Login Methods:
    async googleLogin(googleUser: GoogleUser): Promise<Tokens> {
        const existingUser = await this.findOneByEmail(googleUser.email);

        if (!existingUser) {
            const secureProviderId = await argon2.hash(googleUser.providerId);

            const newUser = await this.createUser({
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                password: secureProviderId,
            });

            if (googleUser.profileImage) {
                await this.prisma.user.update({
                    where: {
                        id: newUser.id,
                    },
                    data: {
                        image: googleUser.profileImage,
                    }
                });
            }

            // Create Tokens:
            const tokens = await this.getTokens(
                newUser.id,
                newUser.email,
                newUser.role,
            )
            // Create Account:
            await this.prisma.account.create({
                data: {
                    userId: newUser.id,
                    providerType: 'oauth-google',
                    provider: googleUser.provider,
                    providerAccountId: googleUser.providerId,
                    accessToken: tokens.accessToken,
                    accessTokenExpires: 60 * 15,
                    tokenType: 'Bearer',
                }
            });

            await this.updateRefreshTokenHashLocal(newUser.id, tokens.refreshToken);

            return tokens;
        } else {
            const account = await this.prisma.account.findFirst({
                where: {
                    userId: existingUser.id,
                    provider: googleUser.provider,
                    providerAccountId: googleUser.providerId,
                } 
            });

            if (account.provider === googleUser.provider && account.providerAccountId === googleUser.providerId) {
                const tokens = await this.getTokens(existingUser.id, existingUser.email, existingUser.role);
                await this.updateRefreshTokenHashLocal(existingUser.id, tokens.refreshToken);
                return tokens;
            } else {
                throw new BadRequestException('User already exists');
            }
        }
    }
    // Facebook Login Methods:
    async facebookLogin(facebookUser: FacebookUser): Promise<Tokens> {
        const existingUser = await this.findOneByEmail(facebookUser.email);

        if (!existingUser) {
            const secureProviderId = await argon2.hash(facebookUser.providerId);

            const newUser = await this.createUser({
                email: facebookUser.email,
                firstName: facebookUser.firstName,
                lastName: facebookUser.lastName,
                password: secureProviderId,
            });

            if (facebookUser.profileImage) {
                await this.prisma.user.update({
                    where: {
                        id: newUser.id,
                    },
                    data: {
                        image: facebookUser.profileImage,
                    }
                });
            }

            // Create Tokens:
            const tokens = await this.getTokens(
                newUser.id,
                newUser.email,
                newUser.role,
            )
            // Create Account:
            await this.prisma.account.create({
                data: {
                    userId: newUser.id,
                    providerType: 'oauth-facebook',
                    provider: facebookUser.provider,
                    providerAccountId: facebookUser.providerId,
                    accessToken: tokens.accessToken,
                    accessTokenExpires: 60 * 15,
                    tokenType: 'Bearer',
                }
            });

            await this.updateRefreshTokenHashLocal(newUser.id, tokens.refreshToken);
            
            return tokens;
        } else {
            const account = await this.prisma.account.findFirst({
                where: {
                    userId: existingUser.id,
                    provider: facebookUser.provider,
                    providerAccountId: facebookUser.providerId,
                }
            });

            if (account.provider === facebookUser.provider && account.providerAccountId === facebookUser.providerId) {
                const tokens = await this.getTokens(existingUser.id, existingUser.email, existingUser.role);
                await this.updateRefreshTokenHashLocal(existingUser.id, tokens.refreshToken);
                return tokens;
            } else {
                throw new BadRequestException('User already exists');
            }
        }
    }


    // Local Logout Methods:
    async localLogout(userId: string) {
        await this.prisma.account.updateMany({
            where: {
                userId,
                refreshToken: {
                    not: null,
                },
            },
            data: {
                refreshToken: null,
            }
        })
    }


    // JWT Methods:
    async updateRefreshTokenHashLocal(userId: string, refreshToken: string) {
        const hash = await argon2.hash(refreshToken);
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not Found');
        }
        
        const account = await this.prisma.account.findFirst({
            where: { userId: userId },
        })

        if (!account) {
            throw new NotFoundException('Account not Found');
        }

        await this.prisma.account.update({
            where: { id: account.id },
            data: { refreshToken: hash },
        })
    }

    async refreshToken(userId: string, refreshToken: string): Promise<Token> {
        const user = await this.findOneById(userId);

        if (!user) {
            throw new NotFoundException('User not Found');
        }
        const account = await this.prisma.account.findFirst({
            where: { userId: userId },
        });

        if (!account) {
            throw new NotFoundException('Account not Found');
        }

        try {
            if (await argon2.verify(account.refreshToken, refreshToken)) {
                const token = await this.getAccessToken(user.id, user.email, user.role);
                await this.prisma.account.update({
                    where: { id: account.id },
                    data: { accessToken: token.accessToken },
                })
                return token;
            } else {
                throw new ForbiddenException('Invalid Refresh Token');
            }
        } catch (err) {
            throw err;
        }
    }

    async getTokens(userId: string, email: string, role: string): Promise<Tokens> {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                userId: userId,
                email: email,
                role: role,
            }, {
                secret: this.config.get('AT_JWT_SECRET_KEY'),
                expiresIn: 60 * 15, // 15 minutes
            }
            ),
            this.jwtService.signAsync({
                userId: userId,
                email: email,
                role: role,
            }, {
                secret: this.config.get('RT_JWT_SECRET_KEY'),
                expiresIn: 60 * 60 * 24 * 7, // 7 days
            }
            ),
        ]);

        return {
            accessToken: at,
            refreshToken: rt,
        }

    }

    async getAccessToken(userId: string, email: string, role: string): Promise<Token> {
        const at = await this.jwtService.signAsync({
            userId: userId,
            email: email,
            role: role,
        }, {
            secret: this.config.get('AT_JWT_SECRET_KEY'),
            expiresIn: 60 * 15, // 15 minutes
        }
        )

        return {
            accessToken: at
        }
    }

    // Get/Create User:
    async createUser(createUserDto: LocalAuthDto) {
        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                firstName: createUserDto.firstName,
                lastName: createUserDto.lastName,
                hashedPassword: createUserDto.password,
            }
        });

        return user;
    }

    async findOneById(id: string): Promise<User | undefined> {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.prisma.user.findUnique({
            where: { email },
        });
    }
}
