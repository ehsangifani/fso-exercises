import React, { useState } from 'react';

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
			<h2>create new</h2>
			<form onSubmit={addBlog}>
				<div>
					<label>
						title:
						<input value={title} name="Title"
							onChange={(e) => setTitle(e.target.value)} />
					</label>
				</div>
				<div>
					<label>
						author:
						<input value={author} name="Author"
							onChange={(e) => setAuthor(e.target.value)} />
					</label>
				</div>
				<div>
					<label>
						url:
						<input value={url} name="Url"
							onChange={(e) => setUrl(e.target.value)} />
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	);

};

export default BlogForm;