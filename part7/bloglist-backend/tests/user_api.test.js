const app = require('../app');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const api = supertest(app);
const User = require('../models/user');
const bcrypt = require('bcrypt');

jest.setTimeout(20000);



describe('when asked to create an invalid user', () => {
	let usersBefore = null;
	let toCreate = {
		username: 'a',
		password: 'b'
	};
	let result = null;

	beforeAll(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();

		usersBefore = await helper.usersInDB();
	});

	test('returns 400 and a suitable message', async () => {
		result = await api
			.post('/api/users').send(toCreate)
			.expect(400).expect('Content-Type', /application\/json/);
		expect(result.body.error)
			.toContain('must be at least 3 characters long');
	});

	test('invalid user is not created', async () => {
		const users = await helper.usersInDB();
		expect(users).toHaveLength(usersBefore.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.log('CONN SUCCESSFULLY CLOSED>>>>');
});