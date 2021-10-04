const request = require('supertest');
const app = require('../../src/app');

const agent = request(app);
describe('Public routes', () => {
  describe('GET - /', () => {
    const getRoot = async () => await agent.get('/');
    it('should have an entry endpoint / to give the welcome to the API', async () => {
      const response = await getRoot();
      expect(response.status).toBe(200);
    });
  });
});
