import anecdoteService from '../services/anecdotes';

const reducer = (state = [], action) => {
	switch (action.type) {
		case 'VOTE': {
			const id = action.data.id;
			const before = state.find(a => a.id === id);
			if (!before) {
				console.error('anecdote id is not valid!!!');
				return state;
			}
			const voted = action.data

			return state.map(a => a.id !== id ? a : voted).sort((a, b) =>
				b.votes - a.votes
			);
		}
		case 'NEW_ANECDOTE':
			return [...state, action.data];
		case 'INIT_ANECDOTES':
			return action.data.sort((a, b) => b.votes - a.votes);
		default:
			return state;
	}
};

export const vote = (anecdote) => {
	return async dispatch => {
		const updated = await anecdoteService
			.update(anecdote.id, { ...anecdote, votes: anecdote.votes + 1 });
		dispatch({
			type: 'VOTE',
			data: updated
		});
	};
};

export const createAnecdote = (content) => {
	return async dispatch => {
		const newAnecdote = await anecdoteService.createNew(content);
		dispatch({
			type: 'NEW_ANECDOTE',
			data: newAnecdote
		});
	};
};

export const initializeAnecdotes = () => {
	return async dispatch => {
		const data = await anecdoteService.getAll();
		dispatch({
			type: 'INIT_ANECDOTES',
			data
		});
	};
};

export default reducer;