const request = require('supertest');
const app = require('../../app');
const { createFakeUserWithToken } = require('../helpers');
const { setupDatabase, tearDownDatabase } = require('../setup');
const { expectToBeError, expectNotToBeError, expectToHaveErrorMessage } = require('../expectHelpers');

describe('Order API', () => {
  let token;
  let fakeUser;

  beforeAll(async () => {
    await setupDatabase();
    const result = await createFakeUserWithToken();
    token = result.token;
    fakeUser = result.fakeUser;
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  describe('GET /api/orders', () => {
    it('should fetch all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expectNotToBeError(response.body);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          customerId: fakeUser.id,
          orderDate: new Date().toISOString(),
          totalAmount: 100.50
        });

      expect(response.status).toBe(201);
      expectNotToBeError(response.body);
      expect(response.body).toHaveProperty('id');
      expect(response.body.totalAmount).toBe(100.50);
    });
  });
});

