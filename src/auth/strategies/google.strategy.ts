import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super({
            clientID: configService.get("GOOGLE_CLIENT_ID"),
            clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
            callbackURL: configService.get("GOOGLE_CALLBACK_URL"),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
    ): Promise<any> {
        const { id, name, emails, photos, provider} = profile;

        const googleUser = {
            providerId: id,
            provider: provider, 
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value,
            emailValidated: emails[0].verified,
            profileImage: photos[0].value,
            accessToken,
            refreshToken,
        }

        done(null, googleUser);
    }
}