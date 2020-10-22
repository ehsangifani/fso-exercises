import React, { useState, useCallback, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { useApolloClient, useSubscription } from '@apollo/client';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import {
	ALL_BOOKS,
	BOOK_ADDED,
	ALL_AUTHORS,
	ME,
	BOOKS_BY_GENRE,
} from './queries';

const Notify = ({ errorMessage }) => {
	if (!errorMessage) {
		return null;
	}
	return <div style={{ color: 'red' }}>{errorMessage}</div>;
};

const App = () => {
	const [token, setToken] = useState(null);
	const [page, setPage] = useState('authors');
	const [errorMessage, setErrorMessage] = useState('');

	const client = useApolloClient();

	useEffect(() => {
		const token = localStorage.getItem('library-user-token');
		if (token) {
			setToken(token);
		}
	}, []);

	const updateCache = (addedBook) => {
		const dataInStore = client.readQuery({ query: ALL_BOOKS });
		if (!dataInStore.allBooks.find((b) => b.id === addedBook.id)) {
			client.writeQuery({
				query: ALL_BOOKS,
				data: {
					...dataInStore,
					allBooks: [...dataInStore.allBooks, addedBook],
				},
			});
			const authors = client.readQuery({ query: ALL_AUTHORS });
			let author = authors.allAuthors.find((a) => a.id === addedBook.author.id);
			let allAuthors = [];
			if (author) {
				author = { ...author };
				author.bookCount++;
				allAuthors = authors.allAuthors.map((a) =>
					a.id === author.id ? author : a
				);
			} else {
				author = { ...addedBook.author, bookCount: 1 };
				allAuthors = [...authors.allAuthors, author];
			}
			client.writeQuery({
				query: ALL_AUTHORS,
				data: {
					...authors,
					allAuthors,
				},
			});

			if (token) {
				const favGen = client.readQuery({ query: ME }).me.favoriteGenre;
				if (!addedBook.genres.includes(favGen)) {
					return;
				}
				const dataInStore = client.readQuery({
					query: BOOKS_BY_GENRE,
					variables: { genre: favGen },
				});
				let book = dataInStore.allBooks.find((b) => b.id === addedBook.id);
				if (book) {
					return;
				}
				client.writeQuery({
					query: BOOKS_BY_GENRE,
					variables: { genre: favGen },
					data: {
						...dataInStore,
						allBooks: [...dataInStore.allBooks, addedBook],
					},
				});
			}
		}
	};

	useSubscription(BOOK_ADDED, {
		onSubscriptionData: ({ subscriptionData }) => {
			const addedBook = subscriptionData.data.bookAdded;
			notify(`${addedBook.title} added`);
			updateCache(addedBook);
		},
	});

	const notify = useCallback(
		(message) => {
			setErrorMessage(message);
			setTimeout(() => {
				setErrorMessage(null);
			}, 10000);
		},
		[setErrorMessage]
	);

	const logout = useCallback(() => {
		setToken(null);
		localStorage.removeItem('library-user-token');
		client.resetStore();
	}, [client, setToken]);

	return (
		<div>
			<Notify errorMessage={errorMessage} />
			<div>
				<button onClick={() => setPage('authors')}>authors</button>
				<button onClick={() => setPage('books')}>books</button>
				{token ? (
					<>
						<button onClick={() => setPage('add')}>add book</button>
						<button onClick={() => setPage('recommendations')}>
							recommend
						</button>
						<button onClick={() => logout()}>logout</button>
					</>
				) : (
					<button onClick={() => setPage('login')}>login</button>
				)}
			</div>

			<Authors show={page === 'authors'} token={token} setError={notify} />

			<Books show={page === 'books'} setError={notify} />

			<NewBook show={page === 'add'} setError={notify} />
			{token ? null : (
				<LoginForm
					show={page === 'login'}
					done={() => setPage('authors')}
					setError={notify}
					setToken={setToken}
				/>
			)}
			{token ? <Recommendations show={page === 'recommendations'} /> : null}
		</div>
	);
};

export default App;
