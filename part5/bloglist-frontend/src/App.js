import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';

const getUid = () => {
	return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const sortByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes);

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [notifications, setNotifications] = useState([]);

	const blogFormRef = React.createRef();

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(sortByLikes(blogs))
		);
	}, []);

	useEffect(() => {
		const userJSON = window.localStorage.getItem('loggedBlogappUser');
		if (userJSON) {
			const user = JSON.parse(userJSON);
			blogService.setToken(user.token);
			setUser(user);
		}
	}, []);

	const pushNotification = (content, type) => {
		const newMsg = { content, type, id: getUid() };
		setNotifications((notifs) => notifs.concat(newMsg));
		setTimeout(() => {
			setNotifications((notifs) => notifs.filter(n => n !== newMsg));
		}, 5000);
	};

	const handleErrorLast = (error) => {
		if (!error.response) {
			//network error
			return pushNotification(error.message, 'error');
		}
		if (process.env.NODE_ENV === 'development') {
			const { data, status, statusText } = error.response;
			const msg = JSON.stringify(data) + '@' + status + ' ' + statusText;
			return pushNotification(msg, 'error');
		}
		pushNotification(error.response.data.error, 'error');
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem('loggedBlogappUser',
				JSON.stringify(user));
			blogService.setToken(user.token);
			pushNotification('Login Successful', 'success');
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (error) {
			handleErrorLast(error);
		}
	};

	const handleLogout = (event) => {
		window.localStorage.removeItem('loggedBlogappUser');
		blogService.setToken(null);
		setUser(null);
		pushNotification('Logout Successful', 'success');
	};

	const handleAddingBlog = async (blogObj, done) => {
		try {
			const newBlog = await blogService.create(blogObj);
			blogFormRef.current.toggleVisibility();
			pushNotification(
				`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success'
			);
			// my backend sends the user.id on PUT,POST we have that
			if (typeof newBlog.user === 'string') {
				const userinfo = {
					id: newBlog.user,
					name: user.name,
					username: user.username
				};
				newBlog.user = userinfo;
			}

			setBlogs(sortByLikes(blogs.concat(newBlog)));
			done();
		} catch (error) {
			handleErrorLast(error);
		}
	};

	const handleLike = async (blog) => {
		const id = blog.id;
		const changedBlog = {
			user: blog.user.id,
			likes: blog.likes + 1,
			author: blog.author,
			title: blog.title,
			url: blog.url
		};
		try {
			const updated = await blogService.update(id, changedBlog);
			// my backend sends the user.id on PUT,POST we have that
			if (typeof updated.user === 'string') {
				if (updated.user !== changedBlog.user) {
					console.error(`blog post ${id} changed ownership!!!`);
				}
				updated.user = blog.user;
			}
			setBlogs(sortByLikes(blogs.map(b => b.id !== id ? b : updated)));
		} catch (error) {
			if (error.response && error.response.status === 404) {
				setBlogs(sortByLikes(blogs.filter(b => b.id !== id)));
				return pushNotification(
					`'${blog.title}' no longer exists on the server`,
					'error'
				);
			}
			handleErrorLast(error);
		}
	};

	const handleDelete = async (blog) => {
		if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
			return;
		}
		const id = blog.id;
		try {
			await blogService.remove(id);
			pushNotification(`Deleted ${blog.title} by ${blog.author}`,
				'success'
			);
			setBlogs(sortByLikes(blogs.filter(b => b.id !== id)));
		} catch (error) {
			//TODO: handle no longer existing blog
			handleErrorLast(error);
		}
	};

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification messages={notifications} />
				<form onSubmit={handleLogin}>
					<div>
						username
						<input type="text" value={username} name="Username"
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
					<div>
						password
						<input type="password" value={password} name="Password"
							onChange={({ target }) => setPassword(target.value)}
						/>
					</div>
					<button type="submit">login</button>
				</form>
			</div>
		);
	}
	return (
		<div>
			<h2>blogs</h2>
			<Notification messages={notifications} />
			<div>
				{user.name} logged in
				<button onClick={handleLogout}>logout</button>
			</div>
			<Togglable buttonLabel="new note" ref={blogFormRef}>
				<BlogForm createBlog={handleAddingBlog} />
			</Togglable>
			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog}
					onLike={() => handleLike(blog)}
					onDelete={blog.user.username === user.username ?
						() => handleDelete(blog) : null}
				/>
			)}
		</div>
	);
};

export default App;