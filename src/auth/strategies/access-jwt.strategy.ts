import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from '../types';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    // Create JWT passport strategy
    constructor(
        private readonly authService: AuthService,
        config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("AT_JWT_SECRET_KEY"),
        });
    }

    // Validate JWT payload
    validate(payload: JwtPayload) {
        return payload;
    }
}