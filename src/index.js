import React from 'react';
import ReactDOM from 'react-dom';

// Redux
// import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import './index.css';
import App from './App';
import './semantic/dist/semantic.min.css'
import registerServiceWorker from './registerServiceWorker';
import store from './redux_helpers/store';

require("./ably");

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
