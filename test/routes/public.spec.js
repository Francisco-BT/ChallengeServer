const request = require('supertest');
const app = require('../../src/app');

describe('Public routes', () => {
  describe('GET - /', () => {
    it('should have an entry endpoint / to give the welcome to the API', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('should returns a message saying Welcome!', async () => {
      const response = await request(app).get('/');
      expect(response.body).toBeDefined();
      expect(response.body.message).toBeDefined();
      expect(response.body.message).toContain('Welcome!');
    });
  });
});
