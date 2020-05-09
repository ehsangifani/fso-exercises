import React, { useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const done = () => {
		setTitle('');
		setAuthor('');
		setUrl('');
	};

	const addBlog = (event) => {
		event.preventDefault();
		createBlog({
			title,
			author,
			url,
		}, done);
	};

	return (
		<div>
			<Typography variant="h4" component="h2">
				create new
			</Typography>
			<form onSubmit={addBlog}>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="title:"
					name="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="author:"
					name="author"
					value={author}
					onChange={(e) => setAuthor(e.target.value)}
				/>
				<TextField
					variant="outlined"
					margin="normal"
					fullWidth
					label="url:"
					name="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				<Button type="submit" variant="contained" color="inherit">
					create
				</Button>
			</form>
		</div>
	);

};

export default BlogForm;