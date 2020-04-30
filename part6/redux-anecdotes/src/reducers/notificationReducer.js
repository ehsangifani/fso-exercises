const genId = () => Number(Math.random() * 1000000).toFixed(0);

const initialState = {};

const notificationReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_MESSAGE':
			return action.data;
		case 'CLEAR_MESSAGE':
			if (state.id === action.data.id) {
				return initialState;
			}
			return state;
		default:
			return state;
	}
};

export const setMessage = (message, seconds) => {
	return async dispatch => {
		const id = genId();
		setTimeout(() =>
			dispatch({
				type: 'CLEAR_MESSAGE',
				data: { id }
			}),
			seconds * 1000
		);
		dispatch({
			type: 'SET_MESSAGE',
			data: {
				message,
				id
			}
		});
	};
};

export default notificationReducer;