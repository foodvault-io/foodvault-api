import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { RefreshJwtStrategy, AccessJwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    AccessJwtStrategy,
    RefreshJwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
