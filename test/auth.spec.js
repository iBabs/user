import request from 'supertest';
import app from '../server.js';

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('user');
        expect(res.body.data).toHaveProperty('accessToken');
    });
});
