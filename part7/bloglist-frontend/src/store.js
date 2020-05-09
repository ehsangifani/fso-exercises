import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import notificationsReducer from './reducers/notificationsReducer';
import blogReducer from './reducers/blogReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
	blogs: blogReducer,
	notifications: notificationsReducer,
	user: userReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;