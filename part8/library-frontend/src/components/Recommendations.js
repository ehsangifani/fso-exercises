import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { ME, BOOKS_BY_GENRE } from '../queries';

const Recommendations = ({ show }) => {
	const [genre, setGenre] = useState(null);
	const resultME = useQuery(ME);
	const [getBooks, result] = useLazyQuery(BOOKS_BY_GENRE);

	useEffect(() => {
		if (resultME.data) {
			const genre = resultME.data.me.favoriteGenre;
			setGenre(genre);
			getBooks({ variables: { genre } });
		}
	}, [resultME.data, getBooks]);

	if (!show) {
		return null;
	}

	if (resultME.loading) {
		return <div>loading...</div>;
	}

	const books = !result.data ? [] : result.data.allBooks;
	return (
		<div>
			<h2>recommendations</h2>
			<p>
				books in your favorite genre <strong>{genre}</strong>
			</p>
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
		</div>
	);
};

export default Recommendations;
