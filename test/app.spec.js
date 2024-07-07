import request from 'supertest';
import app from '../server.js';
import sequelize from '../config/database.js';
import User from '../models/userModel.js';
import Organization from '../models/organizationModel.js';

// const { sequelize, User, Organization } = require('../models');
// import request from 'supertest';
// import { sequelize, User, Organization } from '../models';
// import app from '../index';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ alter: true });
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Organization.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user with a default organisation', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token');

      const user = await User.findOne({
        where: { email: 'john@example.com' },
        include: Organization,
      });

      expect(user.Organizations).toBeDefined();
      expect(user.Organizations.length).toEqual(1);
      expect(user.Organizations[0].name).toEqual("John's Organization");
    });

    it('should return 422 if email already exists', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890',
        });

      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '1234567890',
        });

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 422 if required fields are missing', async () => {
      const res = await request(app).post('/auth/register').send({});
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 422 if firstName is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          lastName: 'Doe',
          email: 'doe@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors[0].msg).toEqual('First name is required');
    });

    it('should return 422 if lastName is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          email: 'doe@example.com',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors[0].msg).toEqual('Last name is required');
    });

    it('should return 422 if email is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'password123',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors[0].msg).toEqual('Email is required');
    });

    it('should return 422 if password is missing', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'doe@example.com',
          phone: '1234567890',
        });
      expect(res.statusCode).toEqual(422);
      expect(res.body.errors[0].msg).toEqual('Password is required');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          password: 'password123',
          phone: '1234567890',
        });

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it('should return 400 if email or password is incorrect', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'jane@example.com',
          password: 'wrongpassword',
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('errors');
    });
  });
});
