import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LocalAuthDto } from '../dto';
import { OAuthUser, Tokens } from '../types';
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

  describe('signUpLocally()', () => {
    const signUpDto: LocalAuthDto = { email: 'test', password: 'password', firstName: 'John', lastName: 'Doe' };
    const tokens: Tokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

    it('should return tokens when user is created', async () => {
      jest.spyOn(authService, 'signUpLocally').mockResolvedValue(tokens);

      const result = await controller.signUpLocally(signUpDto);

      expect(result).toEqual(tokens);
    });
  });

  describe('signInLocally()', () => {
    it('should return tokens when signed in', () => {
      const tokens: Tokens = {
        accessToken:'access_token',
        refreshToken: 'refresh_token',
      }
      const result = controller.signInLocally(tokens);

      expect(result).toEqual(tokens);
    });
  });

  describe('googleAuth()', () => {
    it('should log "Google Auth Route Initiated"', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      controller.googleAuth();

      expect(consoleSpy).toHaveBeenCalledWith('Google Auth Route Initiated');
    });
  });

  describe('googleAuthCallback() ', () => {
    it('should call authService.socialLogin with the user returned from UserFromOAuth', async () => {
      const profile: OAuthUser = {
        providerId: '123456789',
        provider: 'google',
        firstName: 'User',
        lastName: 'Test',
        email: 'test@email.com',
        emailValidated: true,
        photo: null,
      };

    
      const spy = jest.spyOn(authService, 'socialLogin').mockReturnValueOnce(undefined);
      controller.googleAuthCallback(profile);

      expect(spy).toHaveBeenCalledWith(profile);
    });
  });

  describe('facebookAuth() ', () => {
    it('should log "Facebook Auth Route Initiated"', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      controller.facebookAuth();

      expect(consoleSpy).toHaveBeenCalledWith('Facebook Auth Route Initiated');
    });
  });

  describe('facebookAuthCallback() ', () => {
    it('should call authService.socialLogin with the user returned from UserFromOAuth', async () => {
      const profile: OAuthUser = {
        providerId: '123456789',
        provider: 'google',
        firstName: 'User',
        lastName: 'Test',
        email: 'test@email.com',
        emailValidated: true,
        photo: null,
      };


      const spy = jest.spyOn(authService, 'socialLogin').mockReturnValueOnce(undefined);
      controller.facebookAuthCallback(profile);

      expect(spy).toHaveBeenCalledWith(profile);
    });
  });

  describe('logout()', () => {
    it('should call AuthService.localLogout with userId', () => {
      const userId = '1';
      const spy = jest.spyOn(authService, 'localLogout').mockReturnValue(undefined);

      controller.logout(userId);

      expect(spy).toHaveBeenCalledWith(userId);
    });
  });

  describe('refreshToken()', () => {
    const userId = '1';
    const refreshToken = 'refresh_token';

    it('should call AuthService.refreshToken with userId and refreshToken', () => {
      const spy = jest.spyOn(authService, 'refreshToken').mockReturnValue(undefined);

      controller.refreshToken(userId, refreshToken);

      expect(spy).toHaveBeenCalledWith(userId, refreshToken);
    });
  });
});

