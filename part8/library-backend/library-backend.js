const {
	ApolloServer,
	UserInputError,
	AuthenticationError,
	PubSub,
	gql,
} = require('apollo-server');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const Author = require('./models/author');
const Book = require('./models/book');
const User = require('./models/user');

const JWT_SECRET = '983obc!@#ASCYC)!QBPICM@(P)#QAN@!C)NASD0293rhafslzcPOD';
const MONGODB_URI =
	'mongodb://fullstack:password@localhost:27017/graphql-library?retryWrites=true&authSource=admin';

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message);
	});

const pubsub = new PubSub();

const typeDefs = gql`
	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}
	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Query {
		authorCount: Int!
		bookCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
		editAuthor(name: String!, setBornTo: Int!): Author
		createUser(username: String!, favoriteGenre: String!): User
		login(username: String!, password: String!): Token
	}

	type Subscription {
		bookAdded: Book!
	}
`;

const resolvers = {
	Author: {
		bookCount: async (root) => {
			if (Number.isSafeInteger(root.bookCount)) {
				return root.bookCount;
			}
			return await Book.countDocuments({ author: root._id });
		},
	},
	Query: {
		bookCount: () => Book.collection.estimatedDocumentCount(),
		authorCount: () => Author.collection.estimatedDocumentCount(),
		allBooks: async (root, args) => {
			const query = {};
			if (args.author) {
				const author = await Author.findOne({ name: args.author });
				if (!author) {
					return [];
				}
				query.author = author._id;
			}
			if (args.genre) {
				query.genres = { $in: [args.genre] };
			}
			return Book.find(query).populate('author');
		},
		allAuthors: async () => {
			const counts = await Book.aggregate([
				{ $group: { _id: '$author', count: { $sum: 1 } } },
			]).allowDiskUse(true);
			const countMap = new Map(counts.map((a) => [a._id.toString(), a.count]));
			const authors = await Author.find({});
			for (let i = 0; i < authors.length; i++) {
				authors[i].bookCount = countMap.get(authors[i]._id.toString()) || 0;
			}
			return authors;
		},
		me: (root, args, { currentUser }) => {
			return currentUser;
		},
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			const _args = {
				title: args.title.trim(),
				author: args.author.trim(),
				genres: args.genres.map((g) => g.trim()).filter((g) => g.length),
				published: args.published,
			};
			if (!_args.title) {
				throw new UserInputError('title cannot be empty', {
					invalidArgs: args.title,
				});
			}
			if (!_args.author) {
				throw new UserInputError('author cannot be empty', {
					invalidArgs: args.author,
				});
			}
			if (!_args.genres.length) {
				throw new UserInputError('At least one genre must be given', {
					invalidArgs: args.genres,
				});
			}

			let book = await Book.findOne({ title: _args.title });
			if (book) {
				throw new UserInputError('this book title already exists', {
					invalidArgs: _args.title,
				});
			}
			let author = await Author.findOne({ name: _args.author });

			try {
				if (!author) {
					author = new Author({ name: _args.author });
					await author.save();
				}
				book = new Book({ ..._args, author: author._id });
				await book.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			book.author = author;

			pubsub.publish('BOOK_ADDED', { bookAdded: book });
			return book;
		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			const author = await Author.findOne({ name: args.name });
			if (!author) {
				return null;
			}
			author.born = args.setBornTo;
			// Mongoose sends `updateOne({ _id: author._id }, { $set: { born: args.setBornTo } })` to MongoDB
			try {
				await author.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			const bookCount = await Book.countDocuments({ author: author._id });
			author.bookCount = bookCount;
			return author;
		},
		createUser: async (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre,
			});
			try {
				await user.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			return user;
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });
			if (!user || args.password !== 'secret') {
				throw new UserInputError('wrong credentials');
			}
			const userForToken = {
				username: user.username,
				id: user._id,
			};
			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.toLowerCase().startsWith('bearer ')) {
			const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	},
});

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`);
	console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
