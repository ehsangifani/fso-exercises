const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
//const Blog = require('../models/blog');

jest.setTimeout(20000);

beforeAll(async () => {
	/*await Blog.deleteMany({});
	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}*/
	await helper.setupBlogsAndUsers();
	jest.spyOn(console, 'error').mockImplementation((...a) =>
		console.info(...a));
});

describe('blogs are returned', () => {
	let result = null;
	test('blogs are returned as json', async () => {
		result = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('blogs are all returned', () => {
		expect(result.body).toHaveLength(helper.initialBlogs.length);
	});

	test('UID of each is named "id"', () => {
		for (let blog of result.body) {
			expect(blog.id).toBeDefined();
		}
	});
});

describe('a registered user POSTs a new blog with `title` and `url`', () => {
	const newBlog = {
		title: 'Using jest from mluukkai',
		url: 'jestjs.io'
	};
	let res = null;
	test('with success and is added to itself and blogs', async () => {
		res = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${helper.tokens[0]}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);
		const blogs = await helper.blogsInDB();
		expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
		expect(res.body.title).toEqual(newBlog.title);
		expect(res.body.url).toEqual(newBlog.url);
		const titleUrl = blogs.map(blog => ({ title: blog.title, url: blog.url }));
		expect(titleUrl).toContainEqual(newBlog);
		expect(res.body.user).toEqual(helper.initialUsers[0]._id);
		const users = await helper.usersInDB();
		const creator = users.find(u => u.id === helper.initialUsers[0]._id);
		expect(creator.blogs.map(b => b.toString())).toContain(res.body.id);
	});

	test('its likes is 0', () => {
		expect(res.body.likes).toBe(0);
	});
});

describe('for registered user missing title and url results in 400 Bad Request', () => {

	test('when both are missing', async () => {
		const newBlog = {
			author: 'no one'
		};
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${helper.tokens[0]}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('when title is missing', async () => {
		const newBlog = {
			url: 'http://no.one',
			author: 'no one'
		};
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${helper.tokens[0]}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});

	test('when url is missing', async () => {
		const newBlog = {
			title: 'empty things',
			author: 'no one'
		};
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${helper.tokens[0]}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});
});

describe('adding a blog fails with 401 Unauthorized', () => {
	const newBlog = {
		title: '401 Unauthorized',
		url: 'this.should/not/be/added'
	};
	test('when no token is given', async () => {
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);
	});
	test('when an invalid token is given', async () => {
		await api
			.post('/api/blogs')
			.set('Authorization', 'bearer fake token')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);
	});
});

describe('delete operation', () => {
	let blogsBefore = null;
	beforeAll(async () => {
		blogsBefore = await helper.blogsInDB();

	});
	test('401 if no token is given', async () => {
		const toDelete = blogsBefore[0];
		await api
			.delete(`/api/blogs/${toDelete.id}`)
			.expect(401);
	});
	test('401 if invalid token is given', async () => {
		const toDelete = blogsBefore[0];
		await api
			.delete(`/api/blogs/${toDelete.id}`)
			.set('Authorization', 'bearer fake token')
			.expect(401);
	});
	test('401 if user is not the owner of the blog', async () => {
		const toDelete = blogsBefore[0];
		await api
			.delete(`/api/blogs/${toDelete.id}`)
			.set('Authorization', `bearer ${helper.tokens[1]}`)
			.expect(401);
	});
	test('204 No Content success for a valid id', async () => {
		const toDelete = blogsBefore[0];
		const who =
			helper.initialUsers.findIndex(u => u._id === toDelete.user.toString());
		await api
			.delete(`/api/blogs/${toDelete.id}`)
			.set('Authorization', `bearer ${helper.tokens[who]}`)
			.expect(204);

		const blogs = await helper.blogsInDB();
		expect(blogs).toHaveLength(blogsBefore.length - 1);
		const ids = blogs.map(b => b.id);
		expect(ids).not.toContain(toDelete.id);
	});
});

describe('update operation for a valid id', () => {
	test('returns 200 OK on updated likes', async () => {
		const blogsBefore = await helper.blogsInDB();
		const toUpdate = blogsBefore[0];
		const payload = {
			likes: toUpdate.likes + 1
		};
		const result = await api
			.put(`/api/blogs/${toUpdate.id}`)
			.send(payload)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(result.body.id).toBe(toUpdate.id);
		expect(result.body.likes).toBe(payload.likes);

		const blogs = await helper.blogsInDB();
		expect(blogs).toHaveLength(blogsBefore.length);
		const updated = blogs.find(b => b.id === result.body.id);
		expect(updated).toBeDefined();
		updated.user = updated.user.toString();
		expect(updated).toEqual(result.body);
	});

	test('returns 400 on malformed likes', async () => {
		const blogsBefore = await helper.blogsInDB();
		const toUpdate = blogsBefore[0];
		const payload = {
			likes: 4.23
		};
		await api
			.put(`/api/blogs/${toUpdate.id}`)
			.send(payload)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.error.mockRestore();
});