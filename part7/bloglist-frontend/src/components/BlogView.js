import React, { useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeBlog, likeBlog, addCommentToBlog } from '../reducers/blogReducer';
import { Button, Typography, Badge, Divider, TextField, List, ListItem, ListItemText, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: '360px',
		backgroundColor: theme.palette.background.paper,
		[theme.breakpoints.up('sm')]: {
			maxWidth: '70%',
		},
	},
	blog: {
		border: 'solid',
		borderWidth: 1,
		marginBottom: theme.spacing(1)
	}
}));

const BlogView = () => {
	const { id } = useParams();
	const blog = useSelector(state => state.blogs.find(b => b.id === id));
	const username = useSelector(state => state.user.username);
	const dispatch = useDispatch();
	const history = useHistory();
	const classes = useStyles();

	const handleLike = useCallback(() => {
		dispatch(likeBlog(blog));
	}, [blog, dispatch]);

	if (!blog) {
		return null;
	}
	const handleDelete = blog.user.username === username ? () => {
		if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
			return;
		}
		dispatch(removeBlog(blog));
		history.push('/');
	} : null;

	const handleSubmit = (event) => {
		event.preventDefault();
		const comment = event.target.comment.value;
		event.target.submit.disabled = true;
		const input = event.target.comment;
		const button = event.target.submit;
		dispatch(addCommentToBlog(blog, comment, () => {
			input.value = '';
			button.disabled = false;
		}));
	};

	return (
		<div>
			<Typography component="h2" variant="h5">
				{blog.title}
			</Typography>
			<Typography variant="subtitle1">
				<a href={blog.url}>{blog.url}</a><br />
				<span className="likes">{blog.likes}</span>{' '}
				<Button variant="outlined" onClick={handleLike}>like</Button>
			</Typography>

			<Typography variant="subtitle2">
				added by <span className="creator">{blog.user.name}</span>{' '}
				{handleDelete &&
					<Button variant="outlined" onClick={handleDelete}>
						remove
					</Button>
				}
			</Typography>
			<Divider />
			<div>
				<Typography component="h2" variant="h6">
					Comments
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						variant="standard"
						margin="normal"
						fullWidth
						label="comment"
						name="comment"
					/>
					<Button type="submit" name="submit" variant="outlined">
						add comment
					</Button>
				</form>
				<List className={classes.root} aria-label="list of comments on current blog">
					{blog.comments && blog.comments.map(comment =>
						<ListItem key={comment.id} className={classes.blog}>
							<ListItemText primary={`${comment.comment}`} />
						</ListItem>
					)}
				</List>


			</div>
		</div >
	);
};

export default BlogView;