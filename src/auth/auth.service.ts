import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalAuthDto } from './dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interface';

const scrypt = promisify(_scrypt);

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
        return await this.prisma.user.findFirst({
            where: { id },
        });
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.prisma.user.findFirst({
            where: { email },
        });
    }


    // Local Login & SignUp Methods:

    async signUpLocally(localAuthDto: LocalAuthDto): Promise<{ access_token: string }> {
        // Hash password
        const salt = randomBytes(10).toString('hex');

        const buf = (await scrypt(localAuthDto.password, salt, 64)) as Buffer;

        // Join the hashed password and salt together
        const securePassword = `${salt}.${buf.toString('hex')}`;

        // Create User:
        try {
            const user = await this.createUser({
                email: localAuthDto.email,
                firstName: localAuthDto.firstName,
                lastName: localAuthDto.lastName,
                password: securePassword,
            });
            const jwtToken = await this.createToken(
                user.id,
                user.email,
                user.role,
            );

            return {
                access_token: jwtToken,
            };
        } catch (err) {
            if (err.code === 'P2002') {
                throw new BadRequestException('Email already exists');
            }
            throw err;
        }
    }

    async logInLocally(email: string, password: string): Promise<{ auth_token: string }> {
        // Check if user email exists
        const checkUser = await this.findOneByEmail(email);

        if (!checkUser) {
            throw new NotFoundException('User not Found');
        }

        // Split the hashed password and salt
        const [salt, storedHash] = checkUser.hashedPassword.split('.');

        // Hash the password with the salt
        const validatePassword = (await scrypt(password, salt, 64)) as Buffer;

        // Compare the hashed password with the stored hash
        if (storedHash !== validatePassword.toString('hex')) {
            throw new ForbiddenException('Invalid Password');
        }

        // Check if user and hashed password match
        if (checkUser && storedHash == validatePassword.toString('hex')) {
            const token = await this.createToken(
                checkUser.id,
                checkUser.email,
                checkUser.role,
            );

            return {
                auth_token: token,
            };
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

}
