const getUid = () => {
	return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
};

const notificationsReducer = (state = [], action) => {
	switch (action.type) {
		case 'PUSH_MESSAGE':
			return [...state, action.data];
		case 'POP_MESSAGE':
			return state.filter(n => n.id !== action.data.id);
		default:
			return state;
	}
};

export const pushMessage = (content, type, msec = 5000) => {
	return async dispatch => {
		const id = getUid();
		dispatch({
			type: 'PUSH_MESSAGE',
			data: {
				content,
				type,
				id
			}
		});
		setTimeout(() => {
			dispatch({
				type: 'POP_MESSAGE',
				data: { id }
			});
		}, msec);
	};
};







export default notificationsReducer;