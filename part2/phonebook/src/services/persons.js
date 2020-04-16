import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const _unwrap = promise => promise.then(r => r.data);

const getAll = () => {
	return _unwrap(axios.get(baseUrl));
};

const create = newObject => {
	return _unwrap(axios.post(baseUrl, newObject));
};

const remove = id => {
	return _unwrap(axios.delete(`${baseUrl}/${id}`));
};

const update = (id, newObject) => {
	return _unwrap(axios.put(`${baseUrl}/${id}`, newObject));
};

export default {
	getAll,
	create,
	remove,
	update,
};