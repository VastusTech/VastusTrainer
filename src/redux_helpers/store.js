import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import user from "./reducers/userReducer";
import cache from "./reducers/cacheReducer";
import auth from "./reducers/authReducer";
import info from "./reducers/infoReducer";
import search from "./reducers/searchReducer";
import firebase from "./reducers/firebaseReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(combineReducers({
    user,
    cache,
    info,
    auth,
    search,
    firebase,
}), composeEnhancers(applyMiddleware(logger, thunk)));
