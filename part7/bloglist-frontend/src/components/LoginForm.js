import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

const LoginForm = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = async (event) => {
		event.preventDefault();
		onLogin({
			username,
			password
		}, () => {
			setUsername('');
		});
		setPassword('');
	};

	return (
		<form onSubmit={handleLogin}>
			<TextField
				variant="filled"
				margin="normal"
				fullWidth
				label="Username"
				name="username"
				autoFocus
				value={username}
				onChange={({ target }) => setUsername(target.value)}
			/>
			<TextField
				variant="filled"
				margin="normal"
				fullWidth
				label="Password"
				name="password"
				type="password"
				value={password}
				onChange={({ target }) => setPassword(target.value)}
			/>
			<Button type="submit" fullWidth variant="contained" color="primary">
				login
			</Button>
		</form>
	);
};

export default LoginForm;