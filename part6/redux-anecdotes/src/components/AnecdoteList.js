import React from 'react';
import { connect } from 'react-redux';
import { vote as voteOn } from '../reducers/anecdoteReducer';
import { setMessage } from '../reducers/notificationReducer';

const Anecdote = ({ anecdote, handleClick }) => {
	return (
		<div>
			<div>
				{anecdote.content}
			</div>
			<div>
				has {anecdote.votes}
				<button onClick={handleClick}>vote</button>
			</div>
		</div>
	);
};

const AnecdoteList = (props) => {
	return (
		<div>
			{props.anecdotes.map(anecdote =>
				<Anecdote key={anecdote.id}
					anecdote={anecdote}
					handleClick={() => props.handleVote(anecdote, 10)}
				/>
			)}
		</div>
	);
};

const mapStateToProps = (state) => {
	console.log(state);
	if (state.filter === '') {
		return {
			anecdotes: state.anecdotes
		};
	}

	return {
		anecdotes: state.anecdotes.filter(a =>
			a.content.toLowerCase().includes(state.filter)
		)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		handleVote: (anecdote, seconds) => {
			dispatch(voteOn(anecdote));
			dispatch(setMessage(`you voted '${anecdote.content}'`, seconds));
		}
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AnecdoteList);