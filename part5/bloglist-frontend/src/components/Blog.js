import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, onLike, onDelete }) => {
	const [detailVisible, setDetailVisible] = useState('view');
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};
	const handleClick = (event) => {
		setDetailVisible(detailVisible === 'view' ? 'hide' : 'view');
	};

	const detailView = () => (
		<div>
			<span className="url">{blog.url}</span><br />
			<span className="likes">{blog.likes}</span>
			<button onClick={onLike}>like</button>
			<br />
			<span className="creator">{blog.user.name}</span>
			{onDelete &&
				<button onClick={onDelete}>remove</button>
			}
		</div>
	);

	return (
		<div style={blogStyle} className="blog-entry">
			<div>
				{blog.title} {blog.author}
				<button onClick={handleClick}>{detailVisible}</button>
			</div>
			{detailVisible === 'hide' && detailView()}
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	onLike: PropTypes.func.isRequired,
};

export default Blog;
