import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
	let component = null;
	let onLike = null;
	let onDelete = null;
	const blog = {
		title: 'Testing-title',
		author: 'Testing-author',
		url: 'Testing-url',
		likes: 'Testing-likes',
		user: {
			username: 'Testing-username',
			name: 'Testing-name',
			id: 'Testing-user-id'
		},
		id: 'Testing-id'
	};
	beforeEach(() => {
		onLike = jest.fn();
		onDelete = jest.fn();
		component = render(
			<Blog blog={blog} onLike={onLike} onDelete={onDelete} />);
	});

	test('on default shows only title and author', () => {
		expect(component.container).toHaveTextContent('Testing-title');
		expect(component.container).toHaveTextContent('Testing-author');
		expect(component.container).not.toHaveTextContent('Testing-url');
		expect(component.container).not.toHaveTextContent('Testing-likes');
	});

	test('blog url and likes are shown when detail is clicked', () => {
		const detailBtn = component.container.querySelector('button');
		fireEvent.click(detailBtn);

		expect(component.container).toHaveTextContent('Testing-url');
		expect(component.container).toHaveTextContent('Testing-likes');
	});

	test('if like button is clickd twice, its event handler is called twice',
		() => {
			const detailBtn = component.container.querySelector('button');
			fireEvent.click(detailBtn);
			const likeBtn = component.getByText('like');
			fireEvent.click(likeBtn);
			fireEvent.click(likeBtn);
			expect(onLike.mock.calls).toHaveLength(2);
		}
	);
});