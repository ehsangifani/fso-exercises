import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
	token = `bearer ${newToken}`;
};

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then(response => response.data);
};

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token }
	};
	const res = await axios.post(baseUrl, newObject, config);
	return res.data;
};

const update = async (id, changedBlog) => {
	const res = await axios.put(`${baseUrl}/${id}`, changedBlog);
	return res.data;
};

const remove = async (id) => {
	const config = {
		headers: { Authorization: token }
	};
	await axios.delete(`${baseUrl}/${id}`, config);
};

const addComment = async (id, comment) => {
	const res = await axios.post(`${baseUrl}/${id}/comments`, { comment });
	return res.data;
};

export default {
	getAll,
	setToken,
	create,
	update,
	remove,
	addComment
};