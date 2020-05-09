import React, { useEffect, useCallback } from 'react';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import blogService from './services/blogs';
import loginService from './services/login';
import { useDispatch, useSelector } from 'react-redux';
import { pushMessage } from './reducers/notificationsReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import BlogList from './components/BlogList';
import { setUser } from './reducers/userReducer';
import { connectionErrorMessage } from './util/common';
import LoginForm from './components/LoginForm';
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import { useUsers } from './hooks';
import User from './components/User';
import BlogView from './components/BlogView';
// Styles
import { Button, Container, Typography, Badge, Chip, AppBar, Toolbar, Grid, Table, TableContainer, TableRow, TableHead, TableCell, TableBody } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(1),
	},
	userStatus: {
		position: 'relative',
		textAlign: 'right',
		borderRadius: theme.shape.borderRadius,
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1),
			width: '40%',
		},
	},
	navList: {
		flexGrow: 1,
		width: '80%'
	},
}));

const App = () => {
	const user = useSelector(state => state.user);
	const dispatch = useDispatch();
	const blogFormRef = React.createRef();
	const [users,] = useUsers('/api/users');
	const classes = useStyles();

	useEffect(() => {
		dispatch(initializeBlogs());
	}, [dispatch]);

	useEffect(() => {
		const userJSON = window.localStorage.getItem('loggedBlogappUser');
		if (userJSON) {
			const user = JSON.parse(userJSON);
			blogService.setToken(user.token);
			dispatch(setUser(user));
		}
	}, [dispatch]);

	const pushNotification = useCallback((content, type) => {
		dispatch(pushMessage(content, type));
	}, [dispatch]);
	console.log('App RERENDERED');

	const handleLogin = async ({ username, password }, done) => {
		try {
			const user = await loginService.login({ username, password });
			window.localStorage.setItem('loggedBlogappUser',
				JSON.stringify(user));
			blogService.setToken(user.token);
			done();
			pushNotification('Login Successful', 'success');
			dispatch(setUser(user));
		} catch (error) {
			dispatch(connectionErrorMessage(error, pushMessage));
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser');
		blogService.setToken(null);
		dispatch(setUser(null));
		pushNotification('Logout Successful', 'success');
	};

	const handleAddingBlog = (blogObj, done) => {
		dispatch(createBlog(blogObj, () => {
			blogFormRef.current.toggleVisibility();
			done();
		}));
	};

	const match = useRouteMatch('/users/:id');
	const selectedUser = match ?
		users.find(u => u.id === match.params.id)
		: null;

	if (user === null) {
		return (
			<Container maxWidth="xs">
				<Typography component="h2" variant="h5" align="center">
					Log in to application
				</Typography>
				<Notification />
				<LoginForm onLogin={handleLogin} />
			</Container>
		);
	}
	return (
		<Container>
			<AppBar position="static" className={classes.root}>
				<Toolbar component="nav">
					<Grid className={classes.navList}>
						<Button variant="outlined" color="inherit" className={classes.menuButton} component={Link} to="/" >
							blogs
						</Button>
						<Badge color="secondary" badgeContent={users.length}>
							<Button variant="outlined" color="inherit" className={classes.menuButton} component={Link} to="/users">users</Button>
						</Badge>
					</Grid>

					<Typography variant="subtitle2" className={classes.userStatus} component="div">
						{user.name} logged in
						<Button variant="contained" color="default" onClick={handleLogout}>logout</Button>
					</Typography>
				</Toolbar>
			</AppBar>
			<Typography component="h1" variant="h3" align="center">
				blog app
			</Typography>
			<Notification />
			<Switch>
				<Route path="/users/:id">
					<User user={selectedUser} />
				</Route>
				<Route path="/users">
					<Typography variant="h4" component="h2">
						Users
					</Typography>
					<TableContainer>
						<Table aria-label="users table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>
										blogs created
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users.map(user =>
									<TableRow key={user.id}>
										<TableCell component="th">
											<Chip size="small" label={user.name}
												clickable component={Link}
												to={`/users/${user.id}`} />
										</TableCell>
										<TableCell>
											{user.blogs.length}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Route>
				<Route path="/blogs/:id">
					<BlogView />
				</Route>
				<Route path="/">
					<Togglable buttonLabel="create new" ref={blogFormRef}>
						<BlogForm createBlog={handleAddingBlog} />
					</Togglable>
					<BlogList />
				</Route>
			</Switch>

		</Container>
	);
};

export default App;