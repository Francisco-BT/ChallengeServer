const request = require('supertest');
const app = require('../../src/app');
const { Role } = require('../../src/models');
const { sequelize } = require('../../src/services');

afterAll(async () => await sequelize.close());

describe('Roles API V1', () => {
	describe('GET - /roles', () => {
		it('should returns 200 OK', async () => {
			const response = await request(app).get('/api/v1/roles');
			expect(response.statusCode).toBe(200);
		});

		it('should returns an empty array if there are not roles', async () => {
			await Role.destroy({ truncate: true });
			const response = await request(app).get('/api/v1/roles');

			expect(response.body).toBeDefined();
			expect(Array.isArray(response.body)).toBeTruthy();
			expect(response.body).toHaveLength(0);
		});
	});
});
