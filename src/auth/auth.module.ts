import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, RefreshJwtStrategy, AccessJwtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    AccessJwtStrategy,
    RefreshJwtStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
