import request from 'supertest';
import app from '../server.js';
let token;

beforeAll(async () => {
    const res = await request(app)
        .post('/auth/login')
        .send({
            email: 'sample@example.com',
            password: 'passme123'
        });
    token = res.body.data.accessToken;
});

describe('User Endpoints', () => {
    it('should get user details by ID', async () => {
        const res = await request(app)
            .get('/api/users/1c95c396-6938-49bc-9274-6d00ed9c0373') 
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('userId');
    });
});
