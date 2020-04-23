const isMalformedUserPass = (user, pass) => {
	if (user && user.length >= 3) {
		return (pass && pass.length >= 3) ? '' : 'password';
	}
	return 'username';
};

module.exports = {
	isMalformedUserPass,
};