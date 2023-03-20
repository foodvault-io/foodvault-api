import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    // Create JWT passport strategy
    constructor(
        private readonly prisma: PrismaService,
        config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET_KEY"),
        });
    }

    async validate(payload: {
        sub: string;
        email: string;
        role: string;
    }) {
        const user = await this.prisma.user.findUnique({ 
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException();
        }
        if (user.hashedPassword) {
            delete user.hashedPassword;
        }
        return user;
    }
}