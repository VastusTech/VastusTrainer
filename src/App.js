import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import logo from './logo.svg';
import { connect } from 'react-redux';
import './App.css';
import {logIn} from "./redux_helpers/actions/authActions";
import QL from "./GraphQL";
import AppConfig from "./AppConfig";

AppConfig();

class App extends Component {
    constructor(props) {
        super(props);
        this.onSignIn = this.onSignIn.bind(this);
        this.onQuery = this.onQuery.bind(this);
    }
    onSignIn() {
        this.props.signIn("LB", "Comedian1985!");
    }
    onQuery() {
        QL.getClient("CL296596668", ["id", "name"], (data) => {
            alert(JSON.stringify(data));
        }, (error) => {
            alert(JSON.stringify(error));
        })
    }

    render() {
        return (
            <div className="App">
                <Button onClick={this.onSignIn}>Sign in</Button>
                <Button onClick={this.onQuery}>Query</Button>
                <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (username, password) => {
            dispatch(logIn(username, password));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
