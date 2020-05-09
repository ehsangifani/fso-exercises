export const connectionErrorMessage = (error, toMessage) => {
	if (!error.response) {
		//network error
		return toMessage(error.message, 'error');
	}
	if (process.env.NODE_ENV === 'development') {
		const { data, status, statusText } = error.response;
		const msg = JSON.stringify(data) + '@' + status + ' ' + statusText;
		return toMessage(msg, 'error');
	}
	return toMessage(error.response.data.error, 'error');
};