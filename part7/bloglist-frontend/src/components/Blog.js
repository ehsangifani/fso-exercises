import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListItem, ListItemText } from '@material-ui/core';

const Blog = ({ blog, className }) => {
	return (
		<ListItem key={blog.id} button className={`blog-entry ${className}`}
			component={Link} to={`/blogs/${blog.id}`}
		>
			<ListItemText primary={`${blog.title}`}
				secondary={blog.author}
			/>
		</ListItem>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
};

export default Blog;
