import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from "../interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    // Create JWT passport strategy
    constructor(
        private readonly authService: AuthService,
        config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("JWT_SECRET_KEY"),
            expiresIn: config.get("JWT_EXPIRATION_TIME"),
        });
    }

    // Validate JWT payload
    async validate(payload: JwtPayload) {
        const user = await this.authService.validateUserJwt(payload);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}