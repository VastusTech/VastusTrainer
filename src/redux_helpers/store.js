import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import user from "./reducers/userReducer";
import cache from "./reducers/cacheReducer";
import auth from "./reducers/authReducer";
import info from "./reducers/infoReducer";
import search from "./reducers/searchReducer";
import ably from "./reducers/ablyReducer";
import message from "./reducers/messageReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(combineReducers({
    user,
    cache,
    info,
    auth,
    search,
    ably,
    message,
}), composeEnhancers(applyMiddleware(logger, thunk)));
