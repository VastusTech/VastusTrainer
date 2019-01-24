import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import './semantic/dist/semantic.min.css'
import registerServiceWorker from './registerServiceWorker';
import store from './redux_helpers/store';
import AWSConfig from "./AppConfig";
import Lambda from "./vastuscomponents/api/Lambda";
import {ifCallLambdaAtStart} from "./Constants";

require('./vastuscomponents/api/Ably');

// ReactDOM.render(<App />, document.getElementById('root'));
AWSConfig();
if (ifCallLambdaAtStart) { Lambda.ping(); }
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
