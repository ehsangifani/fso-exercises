const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter = require('express').Router();
const { isMalformedUserPass } = require('../utils/input_check');

userRouter.post('/', async (request, response) => {
	const body = request.body;
	const notOk = isMalformedUserPass(body.username, body.password);
	if (notOk) {
		return response
			.status(400)
			.json({ error: `${notOk} must be at least 3 characters long` });
	}
	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash
	});

	const savedUser = await user.save();
	response.json(savedUser);
});

userRouter.get('/', async (request, response) => {
	const users =
		await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 });
	response.json(users.map(u => u.toJSON()));
});

module.exports = userRouter;