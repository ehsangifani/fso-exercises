import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useUsers = (url) => {
	const [users, setUsers] = useState([]);

	const getAll = useCallback(() => {
		axios.get(url)
			.then(response => setUsers(response.data));
	}, [url]);

	useEffect(() => {
		getAll();
	}, [getAll]);

	return [
		users, getAll
	];
};