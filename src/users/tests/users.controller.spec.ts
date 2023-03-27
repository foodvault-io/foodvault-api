import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { AuthService } from '../../auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let prisma: PrismaService;
  let testUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService, AuthService, ConfigService],
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    const createTestUser: CreateUserDto = {
      email: 'thor@odinson.com',
      firstName: 'Thor',
      lastName: 'Odinson',
      password: 'password',
    };

    testUser = await service.createUser(createTestUser);
  });

  afterEach(async () => {
    await prisma.cleanDb(); // Clean up the database
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].id).toEqual(testUser.id);
      expect(result[0].createdAt).toEqual(testUser.createdAt);
      expect(result[0].updatedAt).toEqual(testUser.updatedAt);
      expect(result[0].deletedAt).toEqual(testUser.deletedAt);
      expect(result[0].email).toEqual(testUser.email);
      expect(result[0].firstName).toEqual(testUser.firstName);
      expect(result[0].lastName).toEqual(testUser.lastName);
      expect(result[0].role).toEqual(testUser.role);
      expect(result[0].hashedPassword).toBeUndefined();
      expect(result[0].image).toBeNull();
    });
  });

  describe('findOneById()', () => {
    it('should return a user by id', async () => {
      const result = await controller.findOneById(testUser.id);
      expect(result.id).toEqual(testUser.id);
      expect(result.createdAt).toEqual(testUser.createdAt);
      expect(result.updatedAt).toEqual(testUser.updatedAt);
      expect(result.deletedAt).toEqual(testUser.deletedAt);
      expect(result.email).toEqual(testUser.email);
      expect(result.firstName).toEqual(testUser.firstName);
      expect(result.lastName).toEqual(testUser.lastName);
      expect(result.role).toEqual(testUser.role);
      expect(result.hashedPassword).toBeUndefined();
      expect(result.image).toBeNull();
    });

    it('should throw an error if user is not found', async () => {
      try {
        await controller.findOneById('non-existent-id');
      } catch (err) {
        expect(err.message).toEqual(new NotFoundException('User not found').message);
      }
    });
  });

  describe('findOneByEmail()', () => {
    it('should return a user by email', async () => {
      const result = await controller.findOneByEmail(testUser.email);
      expect(result.id).toEqual(testUser.id);
      expect(result.createdAt).toEqual(testUser.createdAt);
      expect(result.updatedAt).toEqual(testUser.updatedAt);
      expect(result.deletedAt).toEqual(testUser.deletedAt);
      expect(result.email).toEqual(testUser.email);
      expect(result.firstName).toEqual(testUser.firstName);
      expect(result.lastName).toEqual(testUser.lastName);
      expect(result.role).toEqual(testUser.role);
      expect(result.hashedPassword).toBeUndefined();
      expect(result.image).toBeNull();
    });

    it('should throw an error if user is not found', async () => {
      try {
        await controller.findOneByEmail('non-existent-email');
      } catch (err) {
        expect(err.message).toEqual(new NotFoundException('User not found').message);
      }
    });
  });

  describe('update()', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Foster',
      };
      const result = await controller.update(testUser.id, updateUserDto)

      expect(result).toEqual(`This action updates a #${testUser.id} user`)
    });
  });

  describe('remove()', () => {
    it('should soft delete a user', async () => {
      const result = await controller.remove(testUser.id);
      expect(result).toEqual(`This action removes a #${testUser.id} user`);
    });
  });
});
