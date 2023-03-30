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
            clientID: configService.get("FB_FOODVAULT_CLIENT_ID"),
            clientSecret: configService.get("FB_FOODVAULT_CLIENT_SECRET"),
            callbackURL: configService.get("FB_FOODVAULT_CALLBACK_URL"),
            scope: ['email', 'public_profile'],
            profileFields: ['email', 'name', 'photos'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user: any, info?: any) => void,
    ): Promise<any> {
        const { emails, name, id, photos, provider } = profile;

        if (photos === undefined) {
            const facebookUser = {
                providerId: id,
                provider: provider,
                firstName: name.givenName,
                lastName: name.familyName,
                email: emails[0].value,
            }

            done(null, facebookUser);
        } else {
            const facebookUser = {
                providerId: id,
                provider: provider,
                firstName: name.givenName,
                lastName: name.familyName,
                email: emails[0].value,
                photo: photos[0].value,
            }

            done(null, facebookUser);
        }
    }
}
