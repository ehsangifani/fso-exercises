const listHelper = require('../utils/list_helper');
const blogsForTest = require('./blogs_for_test').blogs;

test('dummy returns one', () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	expect(result).toBe(1);
});

describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
	];

	test('of empty list is zero', () => {
		expect(listHelper.totalLikes([])).toBe(0);
	});

	test('when list has only one blog equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog);
		expect(result).toBe(5);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(blogsForTest);
		expect(result).toBe(36);
	});
});

describe('favorite blog', () => {
	test('of empty list is empty object{}', () => {
		expect(listHelper.favoriteBlog([])).toEqual({});
	});

	test('when list has only one blog equals that', () => {
		const expected = blogsForTest.map((v) => {
			return {
				title: v.title,
				author: v.author,
				likes: v.likes
			};
		});
		expect(blogsForTest.map((v) =>
			listHelper.favoriteBlog([v]))
		).toEqual(expected);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.favoriteBlog(blogsForTest);
		expect(result).toEqual({
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			likes: 12
		});
	});

});

describe('most blogs', () => {
	test('of empty list is empty object{}', () => {
		expect(listHelper.mostBlogs([])).toEqual({});
	});

	test('of a list of one blog is {author, blogs:1}', () => {
		const expected = blogsForTest.map((v) => {
			return {
				author: v.author,
				blogs: 1
			};
		});
		expect(blogsForTest.map((v) =>
			listHelper.mostBlogs([v]))
		).toEqual(expected);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.mostBlogs(blogsForTest);
		expect(result).toEqual({
			author: 'Robert C. Martin',
			blogs: 3
		});
	});
});

describe('most likes', () => {
	test('of empty list is empty object{}', () => {
		expect(listHelper.mostLikes([])).toEqual({});
	});

	test('of a list of one blog is {author, likes}', () => {
		const expected = blogsForTest.map((v) => {
			return {
				author: v.author,
				likes: v.likes
			};
		});
		expect(blogsForTest.map((v) =>
			listHelper.mostLikes([v]))
		).toEqual(expected);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.mostLikes(blogsForTest);
		expect(result).toEqual({
			author: 'Edsger W. Dijkstra',
			likes: 17
		});
	});
});