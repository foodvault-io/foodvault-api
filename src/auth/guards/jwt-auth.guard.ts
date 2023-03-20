import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // This is a custom guard that extends the Passport JWT guard
    // and is used to protect routes
    constructor() {
        super();
    }
}