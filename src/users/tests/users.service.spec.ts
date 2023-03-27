import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, ConfigService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.cleanDb();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser()', () => {
    // arange
    const createUserDto: CreateUserDto = {
      firstName: 'Thor',
      lastName: 'Odinson',
      email: 'thor@valhalla.com',
      password: 'Mjolnir',
    };
    it('should create a user and return it', async () => {
      // act
      const user = await service.createUser(createUserDto);

      // assert
      expect(user.email).toEqual(createUserDto.email);
      expect(user.firstName).toEqual(createUserDto.firstName);
      expect(user.lastName).toEqual(createUserDto.lastName);
      expect(user.hashedPassword).toBeDefined();
    });

    it('should throw an error if user already exists', async () => {
      // assert
      await service.createUser(createUserDto);

      await expect(service.createUser(createUserDto)).rejects.toThrow();
    });
  });

  describe('findAll()', () => {
    it('should return an array of users without hashed passwords', async () => {
      // arrange
      const createUserDto: CreateUserDto = {
        firstName: 'Thor',
        lastName: 'Odinson',
        email: 'thor@valhalla.com',
        password: 'Mjolnir',
      };

      const user = await service.createUser(createUserDto);

      // act 
      const users = await service.findAll();

      // assert
      expect(users).toBeDefined();
      expect(users[0].id).toEqual(user.id);
      expect(users[0].email).toEqual(user.email);
      expect(users[0].firstName).toEqual(user.firstName);
      expect(users[0].lastName).toEqual(user.lastName);
      expect(users[0].hashedPassword).not.toBeDefined();
    });
  });

  describe('findOneById()', () => {
    it('should return a user by id', async () => {
      // arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };
      const createdUser = await service.createUser(createUserDto);

      // act
      const foundUser = await service.findOneById(createdUser.id);

      // assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should return undefined if user is not found', async () => {
      // act
      const foundUser = await service.findOneById('invalid-id');

      // assert
      expect(foundUser).toBeNull();
    });
  });

  describe('findOneByEmail()', () => {
    it('should return a user by email', async () => {
      // arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      };
      const createdUser = await service.createUser(createUserDto);

      // act
      const foundUser = await service.findOneByEmail(createdUser.email);

      // assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should return undefined if user is not found', async () => {
      // arrange

      // act
      const foundUser = await service.findOneById('invalid-email@email.com');

      // assert
      expect(foundUser).toBeNull();
    });
  });

  describe('update()', () => {
    it('should return a string', async () => {
      // arrange
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
      }
      const id = 'id';
      const updateString = service.update(id, updateUserDto);

      expect(updateString).toEqual('This action updates a #id user');
    });
  });

  describe('remove()', () => {
    it('should return a string', async () => {
      // arrange
      const id = 'id';
      const deleteString = service.remove(id);

      expect(deleteString).toEqual('This action removes a #id user');
    });
  });
});
