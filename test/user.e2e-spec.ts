import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from '../src/test.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { User } from '../src/users/entities/user.entity';
import { CreateUserDto } from '../src/users/entities/create-user.dto';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let userRepository: Repository<User>;
  let connection: Connection;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    await userRepository.delete({});

    connection = moduleFixture.get(Connection);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await userRepository.delete({});
    await moduleFixture.close();
  });

  describe('GET Users', () => {
    it('should retrieve all users (GET)', async () => {
      // Arrange
      await Promise.all([
        await userRepository.insert(
          new CreateUserDto('testuser@frankly.dk', 'Maria', 'Test', '123456'),
        ),

        await userRepository.insert(
          new CreateUserDto('testuser2@frankly.dk', 'Maria', 'Test', '123456'),
        ),
      ]);

      // Act
      const { body }: { body: User[] } = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      // Assert (expect)
      expect(body.length).toEqual(2);
      expect(body[1].firstName).toEqual('Maria');
    });
  });

  describe('GET User by ID', () => {
    it('should retrieve a user by ID (GET)', async () => {
      // Arrange
      const createDto1 = new CreateUserDto(
        'testuser5@frankly.dk',
        'Maria',
        'Test',
        '123456',
      );
      const createDto2 = new CreateUserDto(
        'testuser4@frankly.dk',
        'Maria',
        'Test',
        '123456',
      );

      const user1 = await userRepository.insert(createDto1);

      // Act
      const { body: retrievedIssue }: { body: User } = await request(
        app.getHttpServer(),
      )
        .get(`/users/${user1.identifiers[0].id}`)
        .expect(200);

      // Assert
      expect(retrievedIssue.id).toEqual(user1.identifiers[0].id);
      expect(retrievedIssue.firstName).toEqual('Maria');
    });
  });

  //   describe('POST user', () => {
  //     it('should create a new user (POST)', async () => {
  //       const user = {
  //         email: 'testuser8@frankly.dk',
  //         password: '1234',
  //         firstName: 'Maria',
  //         lastName: 'Otelea',
  //         role: 'user',
  //       };

  //       const { body }: { body: User } = await request(app.getHttpServer())
  //         .post('/auth/signupdev')
  //         .send(user)
  //         .expect(201);

  //       expect(body.lastName).toEqual('Otelea');
  //       expect(body.email).toEqual('testuser5@frankly.dk');
  //     });
  //   });

  //   describe('DELETE issue by ID', () => {
  //     it('should delete an issue by ID (DELETE)', async () => {
  //       const issue = {
  //         userId: 1,
  //         categoryId: 1,
  //         data: {
  //           issueId: 1,
  //           subject: 'Water issue',
  //           description: 'Water is coming out',
  //         },
  //       };
  //       await request(app.getHttpServer())
  //         .delete(`/issues/${issue.data.issueId}`)
  //         .expect(200);
  //     });
  //   });

  afterAll(() => {
    app.close();
  });
});
