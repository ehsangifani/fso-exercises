import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Display = ({ text, vote }) => {
	return (
		<p>
			{text}<br />
			has {vote} vote{vote === 1 ? '' : 's'}
		</p>
	)
}

const Featured = (props) => {
	const { anecdotes, points } = props;
	const selected = points.reduce((cur, v, i, ar) => {
		return ar[cur] < v ? i : cur;
	}, 0);
	
	return (
		<Display text={anecdotes[selected]} vote={points[selected]} />
	)
}

const App = (props) => {
	const [selected, setSelected] = useState(0);
	const [points, setPoints] = useState(Array(props.anecdotes.length).fill(0));

	const handleClick = () =>
		setSelected(Math.floor(Math.random() * props.anecdotes.length));

	const setVote = () => {
		const new_points = [...points];
		new_points[selected] += 1;
		setPoints(new_points);
	}

	return (
		<div>
			<h1>Anecdote of the day</h1>
			<Display text={props.anecdotes[selected]} vote={points[selected]} />
			<button onClick={setVote}>vote</button>
			<button onClick={handleClick}>show another</button>
			<h2>Anecdote with most votes</h2>
			<Featured anecdotes={props.anecdotes} points={points} />
		</div>
	)
}

const anecdotes = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(
	<App anecdotes={anecdotes} />,
	document.getElementById('root')
);
