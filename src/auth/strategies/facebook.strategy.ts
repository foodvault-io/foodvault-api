import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-facebook";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        // TODO: Create Facebook app and get clientID and clientSecret
        super({
            clientID: configService.get("FACEBOOK_CLIENT_ID"),
            clientSecret: configService.get("FACEBOOK_CLIENT_SECRET"),
            callbackURL: configService.get("FACEBOOK_CALLBACK_URL"),
            profileFields: ['id', 'photos', 'email', 'name'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: any
    ): Promise<any> {
        const { id, name, emails, photos, provider} = profile;

        const facebookUser = {
            providerId: id,
            provider: provider, 
            firstName: name.givenName,
            lastName: name.familyName,
            email: emails[0].value,
            emailValidated: emails,
            profileImage: photos[0].value,
            accessToken,
            refreshToken,
        }

        done(null, facebookUser);
    }
}
