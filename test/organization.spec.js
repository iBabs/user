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

describe('Organisation Endpoints', () => {
    it('should create a new organisation', async () => {
        const res = await request(app)
            .post('/api/organisations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New Organisation',
                description: 'This is a new organisation.'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('orgId');
    });

    it('should get all organisations for the user', async () => {
        const res = await request(app)
            .get('/api/organisations')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('organisations');
    });

    it('should get a single organisation by ID', async () => {
        const res = await request(app)
            .get('/api/organisations/1c95c396-6938-49bc-9274-6d00ed9c0373') // Replace with actual organisation ID
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data).toHaveProperty('orgId');
    });

    it('should add a user to an organisation', async () => {
        const res = await request(app)
            .post('/api/organisations/1c95c396-6938-49bc-9274-6d00ed9c0373/users') // Replace with actual organisation ID
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: '1c95c396-6938-49bc-9274-6d00ed9c0373' // Replace with actual user ID
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body).toHaveProperty('message', 'User added to organisation successfully');
    });
});
