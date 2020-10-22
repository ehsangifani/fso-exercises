import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
	const result = useQuery(ALL_BOOKS);
	const genres = useMemo(() => {
		if (!result.data) {
			return [];
		}
		const s = new Set();
		for (const b of result.data.allBooks) {
			for (const g of b.genres) {
				s.add(g);
			}
		}
		return Array.from(s);
	}, [result.data]);
	const [genre, setGenre] = useState(null);

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	const books = !genre
		? result.data.allBooks
		: result.data.allBooks.filter((b) => b.genres.includes(genre));

	return (
		<div>
			<h2>books</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{books.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			{genres.map((g) => (
				<button key={g} onClick={() => setGenre(g)}>
					{g}
				</button>
			))}
			<button onClick={() => setGenre(null)}>all genres</button>
		</div>
	);
};

export default Books;
