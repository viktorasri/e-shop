import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({});

const INITIAL_STATE = {};

const middleware = [thunk];

const store = createStore(reducer, INITIAL_STATE, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
