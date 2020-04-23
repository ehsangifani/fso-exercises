require('../utils/config');
const initialBlogs = require('./blogs_for_test').blogs;
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const blogIds = initialBlogs.map(b => b._id);
const initialUsers = [
	{
		'username': 'mluukkai',
		'name': 'Matti Luukkainen',
		'_id': '5ea02d263ea768363016ed36',
		'__v': 0
	},
	{
		'username': 'hellas',
		'name': 'Arto Hellas',
		'_id': '5ea02d4b3ea768363016ed37',
		'__v': 0
	}
];

const mluukkaiBlogs = initialBlogs
	.slice(0, 3).map(b => ({ ...b, user: initialUsers[0]._id }));
const hellasBlogs = initialBlogs
	.slice(3).map(b => ({ ...b, user: initialUsers[0]._id }));

const mluukkai = { ...initialUsers[0], blogs: blogIds.slice(0, 3) };
const hellas = { ...initialUsers[1], blogs: blogIds.slice(3) };

const mluukaiToken = jwt.sign({
	username: mluukkai.username, id: mluukkai._id
}, process.env.SECRET);
const hellasToken = jwt.sign({
	username: hellas.username, id: hellas._id
}, process.env.SECRET);

const blogsInDB = async () => {
	const blogs = await Blog.find({});
	return blogs.map(blog => blog.toJSON());
};

const usersInDB = async () => {
	const users = await User.find({});
	return users.map(u => u.toJSON());
};

const setupBlogsAndUsers = async () => {
	await User.deleteMany({});
	await Blog.deleteMany({});
	await User.insertMany([mluukkai, hellas]);
	await Blog.insertMany([...mluukkaiBlogs, ...hellasBlogs]);
};

module.exports = {
	initialBlogs,
	tokens: [mluukaiToken, hellasToken],
	initialUsers: [mluukkai, hellas],
	blogsInDB,
	usersInDB,
	setupBlogsAndUsers,
};