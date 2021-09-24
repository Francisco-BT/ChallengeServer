const publicTestsSuite = (agent) => {
  describe('Public routes', () => {
    describe('GET - /', () => {
      const getRoot = async () => await agent.get('/');
      it('should have an entry endpoint / to give the welcome to the API', async () => {
        const response = await getRoot();
        expect(response.status).toBe(200);
      });
    });
  });
};

module.exports = publicTestsSuite;
