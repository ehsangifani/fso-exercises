import blogService from '../services/blogs';
import { pushMessage } from './notificationsReducer';
import { connectionErrorMessage } from '../util/common';

const sortByLikes = (blogs) => blogs.sort((a, b) => b.likes - a.likes);

const blogReducer = (state = [], action) => {
	switch (action.type) {
		case 'NEW_BLOG':
			return [...state, action.data];
		case 'INIT_BLOGS':
			return sortByLikes(action.data);
		case 'LIKE_BLOG': {
			const id = action.data.id;
			const before = state.find(b => b.id === id);
			if (!before) {
				console.error('blog id is not valid!!!');
				return state;
			}
			const liked = action.data;
			return sortByLikes(state.map(b => b.id !== id ? b : liked));
		}
		case 'COMMENT_ON_BLOG': {
			const id = action.data.id;
			const before = state.find(b => b.id === id);
			if (!before) {
				console.error('blog id is not valid!!!');
				return state;
			}
			return state.map(b => b.id !== id ? b : action.data);
		}
		case 'REMOVE_BLOG':
			return state.filter(b => b.id !== action.data.id);
		default:
			return state;
	}
};


export const addCommentToBlog = (blog, comment, okcb = null) => {
	return async dispatch => {
		const id = blog.id;
		try {
			const commented = await blogService.addComment(id, comment);
			// my backend sends the user.id on PUT,POST we have that
			if (typeof commented.user === 'string') {
				if (commented.user !== blog.user.id) {
					console.error(`blog post ${id} changed ownership!!!`);
				}
				commented.user = blog.user;
			}
			dispatch({
				type: 'COMMENT_ON_BLOG',
				data: commented
			});
			okcb && okcb();
		} catch (error) {
			if (error.response && error.response.status === 404) {
				dispatch({
					type: 'REMOVE_BLOG',
					data: { id }
				});
				return dispatch(pushMessage(
					`'${blog.title}' no longer exists on the server`,
					'error'
				));
			}
			dispatch(connectionErrorMessage(error, pushMessage));
		}
	};
};

export const removeBlog = (blog) => {
	return async dispatch => {
		const id = blog.id;
		try {
			await blogService.remove(id);
			dispatch(pushMessage(`Deleted ${blog.title} by ${blog.author}`,
				'success'
			));
			dispatch({
				type: 'REMOVE_BLOG',
				data: { id }
			});
		} catch (error) {
			//TODO: handle no longer existing blog
			dispatch(connectionErrorMessage(error, pushMessage));
		}
	};
};

export const likeBlog = (blog) => {
	return async dispatch => {
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
			dispatch({
				type: 'LIKE_BLOG',
				data: updated
			});
		} catch (error) {
			if (error.response && error.response.status === 404) {
				dispatch({
					type: 'REMOVE_BLOG',
					data: { id }
				});
				return dispatch(pushMessage(
					`'${blog.title}' no longer exists on the server`,
					'error'
				));
			}
			dispatch(connectionErrorMessage(error, pushMessage));
		}
	};
};

export const createBlog = (blogObj, okcb = null, errcb = null) => {
	return async (dispatch, getState) => {
		try {
			const newBlog = await blogService.create(blogObj);
			// my backend sends the user.id on PUT,POST we have that
			if (typeof newBlog.user === 'string') {
				const user = getState().user;
				const userinfo = {
					id: newBlog.user,
					name: user.name,
					username: user.username
				};
				newBlog.user = userinfo;
			}
			dispatch({
				type: 'NEW_BLOG',
				data: newBlog
			});
			dispatch(pushMessage(
				`a new blog ${newBlog.title} by ${newBlog.author} added`,
				'success'
			));
			okcb && okcb();
		} catch (error) {
			if (errcb) {
				return errcb(error);
			}
			dispatch(connectionErrorMessage(error, pushMessage));
		}
	};
};

export const initializeBlogs = () => {
	return async dispatch => {
		const data = await blogService.getAll();
		dispatch({
			type: 'INIT_BLOGS',
			data
		});
	};
};

export default blogReducer;