import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalSignInDto, LocalAuthDto } from './dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interface';
import * as argon2 from 'argon2';
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private config: ConfigService,
    ) { }

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
            const newAccount = await this.prisma.account.create({
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

    async signInLocally(dto: LocalSignInDto): Promise<Tokens | undefined> {
        const user = await this.findOneByEmail(dto.email);

        if (!user) {
            throw new NotFoundException('User not Found');
        }

        try {
            if (await argon2.verify(user.hashedPassword, dto.password)) {
                const tokens = await this.getTokens(user.id, user.email, user.role);
                await this.updateRefreshTokenHashLocal(user.id, tokens.refreshToken);
                return tokens;
            }
            throw new ForbiddenException('Invalid Password');
        } catch (err) {
            throw err;
        }
    }

    async updateRefreshTokenHashLocal(userId: string, refreshToken: string) {
        const hash = await argon2.hash(refreshToken);
        const account = await this.prisma.account.findFirst({
            where: { userId, provider: 'local', providerType: 'email' },
        })

        if (!account) {
            throw new NotFoundException('Account not Found');
        }

        await this.prisma.account.update({
            where: { id: account.id },
            data: { refreshToken: hash },
        })
    }

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

    async refreshToken(userId: string, refreshToken: string) {
        const user = await this.findOneById(userId);
        const account = await this.prisma.account.findFirst({
            where: { userId: userId, provider: 'local', providerType: 'email' },
        })

        if (!account || !user) {
            throw new NotFoundException('User not Found');
        }

        try {
            if (await argon2.verify(account.refreshToken, refreshToken)) {
                const tokens = await this.getTokens(user.id, user.email, user.role);
                await this.updateRefreshTokenHashLocal(user.id, tokens.refreshToken);
                return tokens;
            } else {
                throw new ForbiddenException('Invalid Refresh Token');
            }
        } catch (err) {
            throw err;
        }
    }

    // JWT Methods:
    async validateUserJwt(payload: JwtPayload): Promise<Partial<User> | undefined> {
        const user = await this.findOneById(payload.userId);

        if (!user) {
            throw new NotFoundException('User not Found');
        }

        const { hashedPassword, ...result } = user;
        return result
    }

    async createToken(userId: string, email: string, role: string): Promise<string> {
        // Create JWT
        const payload = {
            userId: userId,
            email: email,
            role: role,
        };

        const jwtToken = await this.jwtService.signAsync(payload);

        return jwtToken
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

}
