const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((acc, blog) => {
		return acc + blog.likes;
	}, 0);
};

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return {};
	}
	const most = blogs.reduce((most, blog) => {
		return most.likes < blog.likes ? blog : most;
	});
	return {
		title: most.title,
		author: most.author,
		likes: most.likes,
	};
};

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return {};
	}
	const authors = blogs.reduce((most, blog) => {
		const initial = most.get(blog.author) || 0;
		most.set(blog.author, initial + 1);
		return most;
	}, new Map());

	const max = { blogs: -1 };
	authors.forEach((v, author) => {
		if (max.blogs < v) {
			max.blogs = v;
			max.author = author;
		}
	});
	return max;
};

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return {};
	}
	const authors = blogs.reduce((most, blog) => {
		const initial = most.get(blog.author) || 0;
		most.set(blog.author, initial + blog.likes);
		return most;
	}, new Map());

	const max = { likes: -1 };
	authors.forEach((v, author) => {
		if (max.likes < v) {
			max.likes = v;
			max.author = author;
		}
	});
	return max;
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};