import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LocalAuthDto } from '../dto';
import { Tokens } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, ConfigService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUpLocally', () => {
    const signUpDto: LocalAuthDto = { email: 'test', password: 'password', firstName: 'John', lastName: 'Doe' };
    const tokens: Tokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

    it('should return tokens when user is created', async () => {
      jest.spyOn(authService, 'signUpLocally').mockResolvedValue(tokens);

      const result = await controller.signUpLocally(signUpDto);

      expect(result).toEqual(tokens);
    });
  });

  describe('signInLocally', () => {
    const user = { id: '1', username: 'test' };

    it('should return user when signed in', () => {
      const req = { user };

      const result = controller.signInLocally(req);

      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should call AuthService.localLogout with userId', () => {
      const userId = '1';
      const spy = jest.spyOn(authService, 'localLogout').mockReturnValue(undefined);

      controller.logout(userId);

      expect(spy).toHaveBeenCalledWith(userId);
    });
  });

  describe('refreshToken', () => {
    const userId = '1';
    const refreshToken = 'refresh_token';

    it('should call AuthService.refreshToken with userId and refreshToken', () => {
      const spy = jest.spyOn(authService, 'refreshToken').mockReturnValue(undefined);

      controller.refreshToken(userId, refreshToken);

      expect(spy).toHaveBeenCalledWith(userId, refreshToken);
    });
  });
});

