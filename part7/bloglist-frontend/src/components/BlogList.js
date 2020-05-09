import React from 'react';
import Blog from './Blog';
import { useSelector } from 'react-redux';
import { List, makeStyles } from '@material-ui/core';

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

const BlogList = () => {
	const blogs = useSelector(state => state.blogs);
	const classes = useStyles();

	return (
		<div>
			<List aria-label="list of blog entries" className={classes.root}>
				{blogs.map(blog =>
					<Blog key={blog.id} blog={blog} className={classes.blog} />
				)}
			</List>
		</div>
	);
};

export default BlogList;