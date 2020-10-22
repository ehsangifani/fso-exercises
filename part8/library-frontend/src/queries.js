import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
			bookCount
			id
		}
	}
`;

export const ALL_BOOKS = gql`
	query {
		allBooks {
			title
			author {
				name
				id
			}
			published
			genres
			id
		}
	}
`;

export const CREATE_BOOK = gql`
	mutation createBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			title
			author {
				name
				id
			}
			published
			genres
			id
		}
	}
`;

export const EDIT_AUTHOR_BIRTH = gql`
	mutation editAuthorBirth($name: String!, $birth: Int!) {
		editAuthor(name: $name, setBornTo: $birth) {
			name
			born
			bookCount
			id
		}
	}
`;

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`;

export const BOOKS_BY_GENRE = gql`
	query bookByGenre($genre: String!) {
		allBooks(genre: $genre) {
			title
			author {
				name
				id
			}
			published
			genres
			id
		}
	}
`;

export const ME = gql`
	query {
		me {
			username
			favoriteGenre
		}
	}
`;

export const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		id
		title
		author {
			name
			born
			id
		}
		published
		genres
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}

	${BOOK_DETAILS}
`;
