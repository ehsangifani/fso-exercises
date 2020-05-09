import React from 'react';
import { Typography, List, ListItem, ListItemText, Divider, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: '36ch',
		backgroundColor: theme.palette.background.paper,
	},
	inline: {
		display: 'inline',
	},
}));


const User = ({ user }) => {
	const classes = useStyles();
	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Typography variant="h5" component="h2">
				{user.name}
			</Typography>
			<Typography variant="h6" component="h3">
				added blogs
			</Typography>
			<List className={classes.root}>
				{user.blogs.map(blog => {
					return (
						<>
							<ListItem key={blog.id} alignItems="flex-start">
								<ListItemText primary={blog.title} />
							</ListItem>
							<Divider variant="middle" component="li" />
						</>
					);
				})}
			</List>
		</div>
	);
};


export default User;