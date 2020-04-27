const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');
const { isMalformedUserPass } = require('../utils/input_check');

loginRouter.post('/', async (request, response) => {
	const body = request.body;
	if (isMalformedUserPass(body.username, body.password)) {
		return response
			.status(401).json({ error: 'invalid username or password' });
	}
	const user = await User.findOne({ username: body.username });
	const passwordCorrect = user === null ?
		false : await bcrypt.compare(body.password, user.passwordHash);

	if (!(user && passwordCorrect)) {
		return response
			.status(401).json({ error: 'invalid username or password' });
	}
	// date, ip, user-agent,...
	const userForToken = {
		username: user.username,
		id: user._id,
	};

	const token = jwt.sign(userForToken, process.env.SECRET);

	response
		.status(200)
		.send({ token, username: user.username, name: user.name });
});

//TODO: throttle middleware should go here //
// loginRouter.use(some sort of protective middleware)
module.exports = loginRouter;