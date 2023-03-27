import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { JwtPayload } from '../types'; 
import { Request } from "express";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    // Create JWT passport strategy
    constructor(
        private readonly authService: AuthService,
        config: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get("RT_JWT_SECRET_KEY"),
            passReqToCallback: true,
        });
    }

    // Validate JWT payload
    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        return {
            ...payload,
            refreshToken,
        };
    }
}