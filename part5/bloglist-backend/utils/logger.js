const info = (...params) => {
	console.log(...params);
};

const error = (...params) => {
	console.error(...params);
};

module.exports = {
	info: process.env.NODE_ENV !== 'test' ?
		info : () => {},
	error,
};