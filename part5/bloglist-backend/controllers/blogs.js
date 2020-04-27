const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const toSafeInt = (str) => {
	const num = Number(str);
	return Number.isSafeInteger(num) ? num : null;
};

blogRouter.get('/', async (request, response) => {
	const blogs =
		await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
	const body = request.body;
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!request.token || !decodedToken) {
		return response
			.status(401).json({ error: 'token missing or invalid' });
	}

	if (!body.url || !body.title) {
		return response.status(400).json({ error: 'missing url or title' });
	}

	const creator = await User.findById(decodedToken.id);
	// if creator===null, creator._id ==> Internal Server Error
	//eg: user deleted, their token is used to post
	if (!creator) {
		return response.status(401).json({ error: 'invalid token' });
	}
	const blog = new Blog({
		title: body.title,
		url: body.url,
		author: body.author || 'anonymous',
		likes: toSafeInt(body.likes) || 0,
		user: creator._id,
	});

	const result = await blog.save();
	await creator.updateOne({ $push: { blogs: result._id } });
	response.status(201).json(result.toJSON());
});

blogRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (!request.token || !decodedToken) {
		return response
			.status(401).json({ error: 'token missing or invalid' });
	}
	const toDelete = await Blog.findById(request.params.id);
	if (toDelete === null) {
		//decision: 204 or 404?
		return response.status(204).end();
	}
	if (!toDelete.user
		|| toDelete.user.toString() !== decodedToken.id.toString()) {
		return response
			.status(401).json({ error: 'you have no access to this entry' });
	}
	const bId = toDelete._id;
	await toDelete.remove();
	await User.findByIdAndUpdate(decodedToken.id, { $pull: { blogs: bId } });
	//await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
	const likes = toSafeInt(request.body.likes);
	if (likes === null) {
		return response.status(400).json({ error: 'likes must be Integer' });
	}
	const blog = {
		likes
	};
	const result = await Blog
		.findByIdAndUpdate(request.params.id, blog, { new: true });
	if (result === null) {
		return response.status(404).json({error: 'no longer exists'});
	}
	response.json(result.toJSON());
});

module.exports = blogRouter;
