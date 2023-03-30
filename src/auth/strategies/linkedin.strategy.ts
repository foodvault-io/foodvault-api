import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-linkedin-oauth2";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
    constructor(
        private readonly authService: AuthService,
        configService: ConfigService
    ) {
        super({
            clientID: configService.get("LINKEDIN_FOODVAULT_CLIENT_ID"),
            clientSecret: configService.get("LINKEDIN_FOODVAULT_CLIENT_SECRET"),
            callbackURL: configService.get("LINKEDIN_FOODVAULT_CALLBACK_URL"),
            scope: ['r_emailaddress', 'r_liteprofile']
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
            const linkedInUser = {
                providerId: id,
                provider: provider,
                firstName: name.givenName,
                lastName: name.familyName,
                email: emails[0].value,
            }

            done(null, linkedInUser);
        } else {
            const linkedInUser = {
                providerId: id,
                provider: provider,
                firstName: name.givenName,
                lastName: name.familyName,
                email: emails[0].value,
                photo: photos[0].value,
            }

            done(null, linkedInUser);
        }
    }
}
