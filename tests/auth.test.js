const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/lib/prisma');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Note: tests usually shouldn't delete all users in the production or shared database,
    // but since we don't have a dedicated test db URL configured in the plan,
    // we will run this test carefully. It deletes a specific test user if it exists.
    await prisma.user.deleteMany({ where: { email: 'test@example.com' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('POST /api/auth/register → 201', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'pass123',
      name: 'Tester'
    });
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  test('POST /api/auth/login → 200', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'pass123'
    });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });
});
