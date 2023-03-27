import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as pactum from 'pactum';
import * as pactumMatchers from 'pactum-matchers';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { AtJwtGuard } from '../src/common/guards';


describe('Local Auth Login (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
    })
    app.enableCors({
      origin: ['http://192.168.1.125:19000']
    });
    app.useGlobalPipes( new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new AtJwtGuard(reflector));
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();
    await app.listen(3333);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333/api/v1');
  });

  afterAll(() => {
    app.close();
  });

  describe('Local Auth SignUp ', () => { 
    it('Should Create a new User with Local SignUp', async () => {
      return await pactum.spec()
        .post('/auth/local/signup')
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john_doe@gmail.com',
          password: '12345678',
        })
        .expectStatus(201)
        .stores('jwt-access', 'accessToken')
        .stores('jwt-refresh', 'refreshToken')
    });

    it('should return all users', async () => {
      return await pactum.spec()
        .get('/users/')
        .expectStatus(200)
        .expectJsonLength(1)
        .stores('FirstUserId', '[0].id')
        .stores('FirstUserEmail', '[0].email')
        .stores('createdAt', '[0].createdAt')
        .stores('updatedAt', '[0].updatedAt')
        .stores('userRole', '[0].role')
    });

    it('should return user by id', async () => {
      return await pactum.spec()
        .get('/users/{id}')
        .withPathParams('id', '$S{FirstUserId}')
        .withHeaders('Authorization', 'Bearer $S{jwt-access}')
        .expectStatus(200)
        .expectJson({
          id: '$S{FirstUserId}',
          createdAt: '$S{createdAt}',
          updatedAt: '$S{updatedAt}',
          deletedAt: null,
          firstName: 'John',
          lastName: 'Doe',
          email: '$S{FirstUserEmail}',
          image: null,
          role: '$S{userRole}',
        });
    });

    it('should return user by email', async () => {
      return await pactum.spec()
        .get('/users/email/{email}')
        .withPathParams('email', '$S{FirstUserEmail}')
        .withHeaders('Authorization', 'Bearer $S{jwt-access}')
        .expectStatus(200)
        .expectJson({
          id: '$S{FirstUserId}',
          createdAt: '$S{createdAt}',
          updatedAt: '$S{updatedAt}',
          deletedAt: null,
          firstName: 'John',
          lastName: 'Doe',
          email: '$S{FirstUserEmail}',
          image: null,
          role: '$S{userRole}',
        });
    });
  });

  describe('Local Auth SignIn', () => {
    it('Should Log In user', async () => {
      return await pactum.spec()
        .post('/auth/local/login')
        .withHeaders('Content-Type', 'application/json')
        .withBody({
          email: 'john_doe@gmail.com',
          password: '12345678',
        })
        .expectStatus(201)
        .stores('jwt-access', 'accessToken')
        .stores('jwt-refresh', 'refreshToken')
    });
    it('should return all users', async () => {
      return await pactum.spec()
        .get('/users/')
        .expectStatus(200)
        .expectJsonLength(1)
        .stores('FirstUserId', '[0].id')
        .stores('FirstUserEmail', '[0].email')
        .stores('createdAt', '[0].createdAt')
        .stores('updatedAt', '[0].updatedAt')
        .stores('userRole', '[0].role')
    });

    it('should return user by id', async () => {
      return await pactum.spec()
        .get('/users/{id}')
        .withPathParams('id', '$S{FirstUserId}')
        .withHeaders('Authorization', 'Bearer $S{jwt-access}')
        .expectStatus(200)
        .expectJson({
          id: '$S{FirstUserId}',
          createdAt: '$S{createdAt}',
          updatedAt: '$S{updatedAt}',
          deletedAt: null,
          firstName: 'John',
          lastName: 'Doe',
          email: '$S{FirstUserEmail}',
          image: null,
          role: '$S{userRole}',
        });
    });

    it('should return user by email', async () => {
      return await pactum.spec()
        .get('/users/email/{email}')
        .withPathParams('email', '$S{FirstUserEmail}')
        .withHeaders('Authorization', 'Bearer $S{jwt-access}')
        .expectStatus(200)
        .expectJson({
          id: '$S{FirstUserId}',
          createdAt: '$S{createdAt}',
          updatedAt: '$S{updatedAt}',
          deletedAt: null,
          firstName: 'John',
          lastName: 'Doe',
          email: '$S{FirstUserEmail}',
          image: null,
          role: '$S{userRole}',
        });
    });
  });

  describe('Local Auth Refresh Token', () => {
    it('Should Create new Access Token', async () => {
      await pactum.spec()
        .post('/auth/refresh')
        .withHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $S{jwt-refresh}'
        })
        .expectStatus(201)
        .expectJsonMatch(
          pactumMatchers.notEquals('$S{jwt-access}')
        )
        .stores('jwt-access-new', 'accessToken')
    });
  });

  describe('Local Auth Logout', () => {
    it('Should Log Out user and Delete Refresh Token', async () => {
      await pactum.spec()
        .post('/auth/logout')
        .withHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $S{jwt-access}'
        })
        .expectStatus(201)
    });
  })
});
