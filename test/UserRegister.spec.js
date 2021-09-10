const request = require('supertest');
const app = require('../src/app');
const User = require('../src/user/User');
const sequelize = require('../src/services/database');

beforeAll(async () => {
	await sequelize.sync();
});

beforeEach(async () => {
	await User.destroy({ truncate: true });
});

afterAll(async () => await sequelize.close());

describe('User Register', () => {
	async function postValidUser() {
		return await request(app).post('/api/v1/users').send({
			name: 'UserTest',
			email: 'usertest@testmail.com',
			password: 'P4ssw0rd',
		});
	}

	it('should returns 200 OK when register is valid', async () => {
		const response = await postValidUser();
		expect(response.status).toBe(200);
	});

	it('should responses a success message on valid register', async () => {
		const response = await postValidUser();
		expect(response.body.message).toBe('User created');
	});

	it('should saves the user into the database', async () => {
		await postValidUser();
		const users = await User.findAll();
		expect(users).toHaveLength(1);
	});

	it('should saves the user name and email into the database', async () => {
		await postValidUser();
		const users = await User.findAll();
		const user = users[0];
		expect(user.name).toBe('UserTest');
		expect(user.email).toBe('usertest@testmail.com');
	});
});
