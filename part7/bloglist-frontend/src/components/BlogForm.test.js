import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import BlogForm from './BlogForm';

test('', () => {
	const newBlog = {
		title: 'Testing-title',
		author: 'Testing-author',
		url: 'Testing-url'
	};

	const createBlog = jest.fn();
	const component = render(
		<BlogForm createBlog={createBlog} />
	);

	const titleInput = component.getByLabelText('title:');
	const authorInput = component.getByLabelText('author:');
	const urlInput = component.getByLabelText('url:');
	const form = component.container.querySelector('form');

	fireEvent.change(titleInput, {
		target: { value: newBlog.title }
	});

	fireEvent.change(authorInput, {
		target: { value: newBlog.author }
	});

	fireEvent.change(urlInput, {
		target: { value: newBlog.url }
	});

	fireEvent.submit(form);

	expect(createBlog.mock.calls).toHaveLength(1);
	expect(createBlog.mock.calls[0][0]).toEqual(newBlog);


});